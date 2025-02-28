import api from "../api/axios";
import { Task } from "../types/task";

export const fetchTasks = async (): Promise<Task[]> => {
    const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    // Pobranie komentarzy dla każdego zadania
    return await Promise.all(
        res.data.map(async (task: Task) => {
            const commentsRes = await api.get(`/comments/${task.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            return { ...task, comments: commentsRes.data };
        })
    );
};

export const createTask = async (data: Partial<Task>) => {
    return await api.post("/tasks", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};

export const updateTask = async (taskId: string, data: Partial<Task>) => {
    return await api.put(`/tasks/${taskId}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};

export const deleteTask = async (taskId: string) => {
    return await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};
