import { Comment } from './comment';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "done";
    priority: "High" | "Medium" | "Low";
    comments: Comment[]; // Frontend ma już komentarze w strukturze zadania
}
