import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../prisma";
import { publicProcedure, router } from "../../trpc/trpc"; // Adjust import based on your file structure

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  reactions: true,
  createdAt: true,
  updatedAt: true,
  archived: true,
  deleted: true,
  userId: true,
  user: true,
  comments: true,
  parent: true,
  parentId: true,
  thread: false,
  threadId: true,
});

export const commentRouter = router({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        content: z.string(),
        threadId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.comment.create({
        data: input,
      });
    }),

  all: publicProcedure.query(async () => {
    return await prisma.comment.findMany({
      where: { deleted: { equals: false } },
      include: defaultCommentSelect,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: defaultCommentSelect,
      });
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No comment with id '${id}'`,
        });
      }
      return comment;
    }),

  byUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.comment.findMany({
        where: { userId, deleted: { equals: false } },
        include: defaultCommentSelect,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        data: z.object({
          content: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, data } = input;
      return await prisma.comment.update({
        where: { id },
        data,
        include: defaultCommentSelect,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;
      return await prisma.comment.update({
        where: { id },
        data: { deleted: true },
      });
    }),

  unarchive: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;
      return await prisma.comment.update({
        where: { id },
        data: { archived: false },
      });
    }),

  archive: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;
      return await prisma.comment.update({
        where: { id },
        data: { archived: true },
      });
    }),
});
