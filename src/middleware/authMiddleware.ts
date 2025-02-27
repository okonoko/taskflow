import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Brak tokena, dostęp zabroniony" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next(); // WAŻNE: wywołujemy next(), aby middleware przekazał sterowanie dalej.
  } catch (err) {
    res.status(403).json({ message: "Nieprawidłowy token" });
  }
};

export default authMiddleware;
