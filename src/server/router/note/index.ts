import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../prisma";
import { publicProcedure, router } from "../../trpc/trpc";

export const noteRouter = router({
  list: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.note.findMany({
        where: { userId: input.userId },
        include: {
          tags: true,
        },
        orderBy: {
          position: "asc",
        },
      });
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const note = await prisma.note.findUnique({
        where: { id },
      });
      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No note with id '${id}'`,
        });
      }
      return note;
    }),

  updatePositions: publicProcedure
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      return await prisma.$transaction(
        input.map((noteId, index) => {
          return prisma.note.update({
            where: { id: noteId },
            data: { position: index },
          });
        })
      );
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        content: z.string(),
        position: z.number().optional(),
        tags: z
          .array(
            z.object({
              id: z.string().optional(),
              userId: z.string(),
              label: z.string(),
              color: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx?.session?.userId)
        throw new TRPCError({
          message: "Not authenticated",
          code: "UNAUTHORIZED",
        });
      if (input.userId !== ctx.session?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to update this note`,
        });
      }
      const data = {
        ...input,
        tags: {
          connectOrCreate: input?.tags?.map((tag) => ({
            where: { id: tag.id, userId: input.userId },
            create: tag,
          })),
        },
      };
      return await prisma.note.create({
        data,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        content: z.string().optional(),
        position: z.number().optional(),
        tags: z
          .array(
            z.object({
              id: z.string().optional(),
              userId: z.string(),
              label: z.string(),
              color: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.userId)
        throw new TRPCError({
          message: "Not authenticated",
          code: "UNAUTHORIZED",
        });
      if (input.userId !== ctx.session?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to update this note`,
        });
      }
      const data = {
        ...input,
        tags: {
          connectOrCreate: input?.tags?.map((tag) => ({
            where: { id: tag.id, userId: input.id },
            create: tag,
          })),
        },
      };
      return await prisma.note.update({
        where: { id: input.id },
        data,
      });
    }),

  upsertMany: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string().optional(),
          userId: z.string(),
          content: z.string(),
          position: z.number(),
        })
      )
    )
    .mutation(async ({ input }) => {
      return await prisma.$transaction(
        input.map((note) => {
          return prisma.note.upsert({
            where: { id: note.id },
            create: note,
            update: note,
          });
        })
      );
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId !== ctx.session?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You are not authorized to update this note`,
        });
      }
      return await prisma.note.delete({
        where: { id: input.id },
      });
    }),
});
