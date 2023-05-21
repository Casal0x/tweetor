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
                    userId: currentUserId,
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
                  userId: currentUserId,
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
  toggleFollow: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.userId || "";
      const existingFollow = await ctx.prisma.profile.findFirst({
        where: {
          userId: userId,
          followers: { some: { userId: currentUserId } },
        },
      });

      let addedFollow;
      if (existingFollow == null) {
        await ctx.prisma.profile.update({
          where: { userId: userId },
          data: { followers: { connect: { userId: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.profile.update({
          where: { userId: userId },
          data: { followers: { disconnect: { userId: currentUserId } } },
        });
        addedFollow = false;
      }

      const currentProfile = await ctx.prisma.profile.findUnique({
        where: { userId: currentUserId },
      });

      existingFollow &&
        void ctx.revalidateSSG?.(`/@${existingFollow.username}`);
      currentProfile &&
        void ctx.revalidateSSG?.(`/@${currentProfile.username}`);

      return { addedFollow };
    }),
});

export default profileRouter;
