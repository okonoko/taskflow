import { Request, Response } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../services/taskService";

export const addTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, description } = req.body;
    const task = await createTask(userId, title, description);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const tasks = await getTasks(userId);
    res.json(tasks);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const task = await updateTask(id, userId, req.body);
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    await deleteTask(id, userId);
    res.json({ message: "Task usunięty" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
