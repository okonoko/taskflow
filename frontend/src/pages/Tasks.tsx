import { useEffect, useState } from "react";
import { Button, message, Card, Tag, Modal, Form, Input, Select } from "antd";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { addComment } from "../services/commentService";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/task";

const priorityColors: any = {
    High: "red",
    Medium: "orange",
    Low: "green",
};

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [modalData, setModalData] = useState<any>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    
    // Modal do komentarzy
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [commentTaskId, setCommentTaskId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");

    // 🔹 Pobieranie zadań na start i po każdej zmianie
    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await fetchTasks();
            setTasks(data);
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
                await createTask(values);
                message.success("Dodano zadanie!");
            } else {
                await updateTask(modalData.id, values);
                message.success("Zaktualizowano zadanie!");
            }
            setIsModalOpen(false);
            form.resetFields();
            loadTasks(); // 🔹 Odświeżamy listę
        } catch (err) {
            message.error("Nie udało się dodać/edytować zadania");
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            message.success("Usunięto zadanie!");
            loadTasks(); // 🔹 Odświeżamy listę po usunięciu
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
            await addComment(commentTaskId, commentText);
            message.success("Dodano komentarz!");
            setCommentText("");
            setIsCommentModalOpen(false);
            loadTasks(); // 🔹 Odświeżamy listę po dodaniu komentarza
        } catch (err) {
            message.error("Nie udało się dodać komentarza");
        }
    };

    return (
        <div>
            <h1>Lista Zadań</h1>
            <Button type="primary" danger onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
                Wyloguj
            </Button>

            <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {tasks.map((task) => (
                    <Card key={task.id} title={task.title} extra={<Tag color={priorityColors[task.priority]}>{task.priority}</Tag>}>
                        <p>{task.description}</p>
                        <Button onClick={() => handleModalOpen("edit", task)}>Edytuj</Button>
                        <Button danger onClick={() => handleDeleteTask(task.id)}>Usuń</Button>
                        <Button onClick={() => handleCommentModalOpen(task.id)}>Dodaj komentarz</Button>
                    </Card>
                ))}
            </div>

            <Button type="primary" onClick={() => handleModalOpen("add")}>Dodaj zadanie</Button>

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
            <Modal title="Dodaj komentarz" open={isCommentModalOpen} onCancel={() => setIsCommentModalOpen(false)} onOk={handleAddComment}>
                <Input.TextArea value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            </Modal>
        </div>
    );
};

export default Tasks;
