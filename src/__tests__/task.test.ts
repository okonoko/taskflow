import request from "supertest";
import app from "../app";

let token: string;

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send({
    email: "test2@example.com",
    password: "password123",
  });
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "test2@example.com",
    password: "password123",
  });
  token = loginRes.body.token;
});

describe("Task API", () => {
  let taskId: string;

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Nowe zadanie", description: "Opis zadania" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Nowe zadanie");
    taskId = res.body.id;
  });

  it("should fetch tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Zmienione zadanie" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Zmienione zadanie");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
