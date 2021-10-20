import jwt from 'jsonwebtoken';

export const generateToken = (data: Record<string, any>) =>
  jwt.sign(data, process.env.JWT_SECRET as string);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string);
