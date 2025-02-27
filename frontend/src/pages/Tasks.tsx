import { useState, useEffect } from "react";
import { Button, message, Card, Tag, Modal, Form, Input, Select } from "antd";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface Comment {
    id: string;
    text: string;
    createdAt: string;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "done";
    priority: "High" | "Medium" | "Low";
    comments: Comment[];
}


const priorityColors: any = {
    High: "red",
    Medium: "orange",
    Low: "green",
};

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);


    // Modal do dodawania / edycji
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [modalData, setModalData] = useState<any>(null);
    const [form] = Form.useForm();

    // Modal do komentarzy
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [commentTaskId, setCommentTaskId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            message.error("Musisz się zalogować!");
            navigate("/");
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            // Pobranie komentarzy dla każdego zadania
            const tasksWithComments: Task[] = await Promise.all(
                res.data.map(async (task: Task) => {
                    const commentsRes = await api.get(`/comments/${task.id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    return { ...task, comments: commentsRes.data };
                })
            );

            setTasks(tasksWithComments);
        } catch (err) {
            message.error("Nie udało się pobrać zadań");
        }
    };


    const handleModalOpen = (mode: "add" | "edit", task?: any) => {
        setModalMode(mode);
        setModalData(task || null);
        form.setFieldsValue(task || { title: "", description: "", priority: "Medium", status: "pending" });
        setIsModalOpen(true);
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (modalMode === "add") {
                await api.post("/tasks", values, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                message.success("Dodano zadanie!");
            } else {
                await api.put(`/tasks/${modalData.id}`, values, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                message.success("Zaktualizowano zadanie!");
            }
            setIsModalOpen(false);
            form.resetFields();
            fetchTasks();
        } catch (err) {
            message.error(`Nie udało się ${modalMode === "add" ? "dodać" : "edytować"} zadania`);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            message.success("Usunięto zadanie!");
            fetchTasks();
        } catch (err) {
            message.error("Nie udało się usunąć zadania");
        }
    };

    const handleCommentModalOpen = (taskId: string) => {
        setCommentTaskId(taskId);
        setIsCommentModalOpen(true);
    };

    const handleAddComment = async () => {
        if (!commentTaskId) return;
        try {
            await api.post(`/comments/${commentTaskId}`, { text: commentText }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            message.success("Dodano komentarz!");
            setCommentText("");
            setIsCommentModalOpen(false);
            fetchTasks();
        } catch (err) {
            message.error("Nie udało się dodać komentarza");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        message.success("Wylogowano!");
        navigate("/");
    };

    return (
        <div>
            <h1>Lista Zadań</h1>
            <Button type="primary" danger onClick={handleLogout} style={{ marginBottom: 20 }}>
                Wyloguj
            </Button>

            {/* 🔴 LISTA ZADAŃ */}
            <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {tasks.map((task: any) => (
                    <Card key={task.id} title={task.title} extra={<Tag color={priorityColors[task.priority]}>{task.priority}</Tag>}>
                        <p>{task.description}</p>

                        {/* 🔹 KOMENTARZE */}
                        {task.comments.length > 0 ? (
                            <div style={{ marginTop: 10 }}>
                                <strong>Komentarze:</strong>
                                {task.comments.map((comment: any) => (
                                    <p key={comment.id} style={{ fontSize: "14px", margin: "5px 0", borderBottom: "1px solid #eee", paddingBottom: 5 }}>
                                        {comment.text}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: "14px", fontStyle: "italic", color: "#aaa" }}>Brak komentarzy</p>
                        )}

                        <Button onClick={() => handleModalOpen("edit", task)}>Edytuj</Button>
                        <Button danger onClick={() => handleDeleteTask(task.id)}>Usuń</Button>
                        <Button onClick={() => handleCommentModalOpen(task.id)}>Dodaj komentarz</Button>
                    </Card>
                ))}
            </div>

            <Button type="primary" onClick={() => handleModalOpen("add")} style={{ marginTop: 20 }}>
                Dodaj zadanie
            </Button>

            {/* 🔴 MODAL: DODAWANIE / EDYCJA ZADANIA */}
            <Modal
                title={modalMode === "add" ? "Dodaj nowe zadanie" : "Edytuj zadanie"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleModalSubmit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Tytuł" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Opis" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Status" name="status">
                        <Select>
                            <Select.Option value="pending">Oczekujące</Select.Option>
                            <Select.Option value="in_progress">W toku</Select.Option>
                            <Select.Option value="done">Zakończone</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Priorytet" name="priority">
                        <Select>
                            <Select.Option value="High">Wysoki</Select.Option>
                            <Select.Option value="Medium">Średni</Select.Option>
                            <Select.Option value="Low">Niski</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 🔴 MODAL: DODAWANIE KOMENTARZA */}
            <Modal
                title="Dodaj komentarz"
                open={isCommentModalOpen}
                onCancel={() => setIsCommentModalOpen(false)}
                onOk={handleAddComment}
            >
                <Input.TextArea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Wpisz komentarz..."
                />
            </Modal>
        </div>
    );
};

export default Tasks;
