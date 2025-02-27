import express from "express";
import { createComment, fetchComments, removeComment } from "../controllers/commentController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/:taskId", authMiddleware, createComment); // Dodawanie komentarza
router.get("/:taskId", authMiddleware, fetchComments); // Pobieranie komentarzy dla zadania
router.delete("/:commentId", authMiddleware, removeComment); // Usuwanie komentarza

export default router;
