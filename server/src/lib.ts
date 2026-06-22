import process from 'process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserStatus } from '@prisma/client';
import { Resend } from 'resend';

export const prisma = new PrismaClient();

export const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET);

export const isBlocked = (status: UserStatus) => status === 'blocked';