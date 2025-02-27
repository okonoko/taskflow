export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "done";
  priority: "High" | "Medium" | "Low";
  userId: string;  // Backend musi wiedzieć, który user jest właścicielem
  createdAt: Date;
}