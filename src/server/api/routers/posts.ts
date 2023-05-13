import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { ratelimit } from "~/server/helpers/rateLimit";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { ReturnedUser } from "~/server/helpers/filterUserForClient";
import type { Post, PrismaClient, Profile } from "@prisma/client";

type Context = {
  prisma: PrismaClient;
  userId: string | null;
};

type UsersProfileResults = {
  users: ReturnedUser[];
  profiles: Profile[];
};

const getUsersProfiles = async (
  ctx: Context,
  posts: Post[]
): Promise<UsersProfileResults> => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  const profiles = await ctx.prisma.profile.findMany({
    where: {
      userId: {
        in: userId,
      },
    },
  });

  return { users, profiles };
};

const addUserDataToPosts = (
  posts: Post[],
  { profiles }: UsersProfileResults
) => {
  return posts.map((post) => {
    const author = profiles.find((user) => user.userId === post.authorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author has no External Account: ${author.id}`,
      });
    }
    return {
      post,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      //generate pagination
      take: 100,
    });

    if (!posts) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No posts found.",
      });
    }
    const usersProfiles = await getUsersProfiles(ctx, posts);

    return addUserDataToPosts(posts, usersProfiles);
  }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No post found.",
        });
      }
      const usersProfiles = await getUsersProfiles(ctx, [post]);

      return addUserDataToPosts([post], usersProfiles)[0];
    }),
  getPostsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPosts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.userId,
        },
        orderBy: { createdAt: "desc" },
      });
      // console.log("userPosts", userPosts);
      const usersProfiles = await getUsersProfiles(ctx, userPosts);
      return addUserDataToPosts(userPosts, usersProfiles);
    }),
  createPost: privateProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Maximum post 3 per minute.",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId,
        },
      });

      return post;
    }),
});
