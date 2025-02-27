import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCommentToTask = async (taskId: string, text: string) => {
  return await prisma.comment.create({
    data: {
      text,
      taskId,
      createdAt: new Date(), // ✅ Ustawienie `createdAt` dla komentarza
    },
  });
};

export const getCommentsForTask = async (taskId: string) => {
  return await prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteComment = async (commentId: string) => {
  return await prisma.comment.delete({
    where: { id: commentId },
  });
};
