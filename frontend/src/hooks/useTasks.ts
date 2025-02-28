import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { Task } from "../types/task";
import { message } from "antd";

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
            } catch (err) {
                message.error("Nie udało się pobrać zadań");
            }
        };
        loadTasks();
    }, []);

    return { tasks, setTasks };
};
