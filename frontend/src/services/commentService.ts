import api from "../api/axios";
import { Comment } from "../types/comment";

export const fetchComments = async (taskId: string): Promise<Comment[]> => {
    const res = await api.get(`/comments/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
};

export const addComment = async (taskId: string, text: string) => {
    return await api.post(`/comments/${taskId}`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};
