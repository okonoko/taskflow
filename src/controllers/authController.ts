import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body.email, req.body.password);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { token, user } = await loginUser(req.body.email, req.body.password);
    res.json({ token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
