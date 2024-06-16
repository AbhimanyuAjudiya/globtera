import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateToken = (id: number, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET!);
};
