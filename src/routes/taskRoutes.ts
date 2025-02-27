import express from "express";
import { addTask, listTasks, editTask, removeTask } from "../controllers/taskController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, listTasks);
router.put("/:id", authMiddleware, editTask);
router.delete("/:id", authMiddleware, removeTask);

export default router;
