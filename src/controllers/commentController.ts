import { Request, Response, NextFunction } from "express";
import { addCommentToTask, getCommentsForTask, deleteComment } from "../services/commentService";

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!taskId || !text) {
      res.status(400).json({ message: "Brak wymaganych pól" });
      return;
    }

    const comment = await addCommentToTask(taskId, text);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const fetchComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      res.status(400).json({ message: "Brak ID zadania" });
      return;
    }

    const comments = await getCommentsForTask(taskId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const removeComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commentId } = req.params;

    if (!commentId) {
      res.status(400).json({ message: "Brak ID komentarza" });
      return;
    }

    await deleteComment(commentId);
    res.status(200).json({ message: "Komentarz usunięty" });
  } catch (err) {
    next(err);
  }
};
