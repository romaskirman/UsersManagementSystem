import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, UserStatus } from '@prisma/client';
import process from 'process';

export const prisma = new PrismaClient();
export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
export const signToken = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET) as any;
export const isBlocked = (status: UserStatus) => status === 'blocked';