import { useState } from "react";
import { Button, Input, Form, message } from "antd";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);
      localStorage.setItem("token", res.data.token);
      message.success("Zalogowano!");
      navigate("/tasks");
    } catch (err) {
      message.error("Błąd logowania");
    }
    setLoading(false);
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Hasło" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Zaloguj się
      </Button>
    </Form>
  );
};

export default Login;
