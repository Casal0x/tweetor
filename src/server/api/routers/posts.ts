import { z } from "zod";
import { clerkClient } from "@clerk/nextjs";
import { ratelimit } from "~/server/helpers/rateLimit";

import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
  type createTRPCContext,
} from "~/server/api/trpc";
import { TRPCError, type inferAsyncReturnType } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { ReturnedUser } from "~/server/helpers/filterUserForClient";
import type { Post, Prisma, PrismaClient, Profile } from "@prisma/client";

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
  const userId = posts.map((post) => post.profileId);
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
    const author = profiles.find((user) => user.userId === post.profileId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.profileId}`,
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
  infinitePostFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx?.userId;
        const profile = await ctx.prisma.profile.findUnique({
          where: {
            userId: currentUserId || "",
          },
        });

        const profileId = profile?.id;

        return await getInfinitePosts({
          limit,
          ctx,
          cursor,
          whereClause:
            profileId == null || !onlyFollowing
              ? undefined
              : {
                  profile: {
                    followers: { some: { id: profileId } },
                  },
                },
        });
      }
    ),
  infiniteProfilePostFeed: publicProcedure
    .input(
      z.object({
        profileId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, cursor, profileId }, ctx }) => {
      return await getInfinitePosts({
        limit,
        ctx,
        cursor,
        whereClause: {
          profileId: profileId,
        },
      });
    }),
  // getById: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const post = await ctx.prisma.post.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //     if (!post) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "No post found.",
  //       });
  //     }
  //     const usersProfiles = await getUsersProfiles(ctx, [post]);

  //     return addUserDataToPosts([post], usersProfiles)[0];
  //   }),
  getPostsByUserId: publicProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userPosts = await ctx.prisma.post.findMany({
        where: {
          profileId: input.profileId,
        },
        orderBy: { createdAt: "desc" },
      });

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
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          userId: authorId,
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No profile found.",
        });
      }

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
          profileId: profile.id,
        },
      });

      return post;
    }),
  toggleLike: privateProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input: { postId }, ctx }) => {
      const authorId = ctx.userId;
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          userId: authorId,
        },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No profile found.",
        });
      }

      const data = { profileId: profile.id, postId };

      const existingLike = await ctx.prisma.likes.findUnique({
        where: {
          profileId_postId: data,
        },
      });

      console.log(existingLike);

      if (existingLike == null) {
        await ctx.prisma.likes.create({ data });
        return { addedLike: true };
      } else {
        await ctx.prisma.likes.delete({ where: { profileId_postId: data } });
        return { addedLike: false };
      }
    }),
});

async function getInfinitePosts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.PostWhereInput;
  limit: number;
  cursor: { id: string; createdAt: Date } | undefined;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
}) {
  const currentUserId = ctx.userId;
  const profile = await ctx.prisma.profile.findUnique({
    where: {
      userId: currentUserId || "",
    },
  });

  const data = await ctx.prisma.post.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: { select: { likes: true } },
      likes: profile?.id == null ? false : { where: { profileId: profile.id } },
      profile: {
        select: {
          id: true,
          profileImageUrl: true,
          username: true,
          userId: true,
        },
      },
    },
  });

  let nextCursor: typeof cursor | undefined;
  if (data.length > limit) {
    const nextItem = data.pop();
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
    }
  }

  return {
    posts: data.map((post) => {
      return {
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        likeCount: post._count.likes,
        profile: post.profile,
        likedByMe: post.likes?.length > 0,
      };
    }),
    nextCursor,
  };
}
