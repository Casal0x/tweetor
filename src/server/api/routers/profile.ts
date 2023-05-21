import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

const profileRouter = createTRPCRouter({
  setProfile: privateProcedure
    .input(
      z.object({
        username: z.string(),
        profileImageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (userId) {
        const profile = await ctx.prisma.profile.create({
          data: {
            userId: userId,
            username: input.username,
            profileImageUrl: input.profileImageUrl,
          },
        });

        return profile;
      }
    }),
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.userId;
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
          userId: true,
          username: true,
          profileImageUrl: true,
          _count: { select: { followers: true, following: true, Post: true } },
          followers:
            currentUserId === null
              ? undefined
              : {
                  where: {
                    id: currentUserId,
                  },
                },
        },
      });

      if (!profile)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });

      return {
        ...profile,
        followersCount: profile._count.followers,
        followsCount: profile._count.following,
        postsCount: profile._count.Post,
        isFollowing: profile.followers.length > 0,
        ownProfile: currentUserId === profile.userId,
      };
    }),
  getProfileById: publicProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.userId || "";

    const profile = await ctx.prisma.profile.findUnique({
      where: {
        userId: currentUserId,
      },
      select: {
        id: true,
        userId: true,
        username: true,
        profileImageUrl: true,
        _count: { select: { followers: true, following: true, Post: true } },
        followers:
          currentUserId === null
            ? undefined
            : {
                where: {
                  id: currentUserId,
                },
              },
      },
    });

    if (!profile) return null;

    return {
      ...profile,
      followersCount: profile._count.followers,
      followsCount: profile._count.following,
      postsCount: profile._count.Post,
      isFollowing: profile.followers.length > 0,
      ownProfile: currentUserId === profile.userId,
    };
  }),
});

export default profileRouter;
