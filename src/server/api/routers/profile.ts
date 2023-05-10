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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      if (userId) {
        const profile = await ctx.prisma.profile.create({
          data: {
            userId: userId,
            username: input.username,
          },
        });

        return profile;
      }
    }),
  getProfileById: publicProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        userId: ctx.userId || "",
      },
    });

    return profile;
  }),
});

export default profileRouter;
