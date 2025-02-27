import { PrismaClient } from "@prisma/client";
import { Task } from "../types/task";

const prisma = new PrismaClient();

export const createTask = async (userId: string, title: string, description?: string) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      userId,
      createdAt: new Date(), // ✅ Ustawienie wartości `createdAt`
      updatedAt: new Date(), // ✅ `updatedAt` również od razu ustawiony
    },
  });
};

export const getTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: { userId },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: Partial<Omit<Task, "id" | "userId" | "createdAt">> // ✅ Nie pozwalamy na zmianę `createdAt`
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) throw new Error("Brak dostępu do tego zadania");

  return await prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      updatedAt: new Date(), // ✅ Prisma automatycznie ustawi `updatedAt`
    },
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) throw new Error("Brak dostępu do tego zadania");

  return await prisma.task.delete({
    where: { id: taskId },
  });
};

