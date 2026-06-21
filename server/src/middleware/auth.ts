import { NextFunction, Request, Response } from 'express';
import { prisma, verifyToken } from '../lib.js';
import { MESSAGES } from '../constants/messages.js';
import { AuthUser, JwtPayload } from '../types/auth.js';

type AuthedRequest = Request & {
  user?: AuthUser;
};

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: MESSAGES.unauthorized });
    }

    const token = header.slice(7);
    const payload = verifyToken(token) as JwtPayload;

    if (!payload?.sub) {
      return res.status(401).json({ message: MESSAGES.unauthorized });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: MESSAGES.rightsLost });
    }

    (req as AuthedRequest).user = user;
    return next();
  } catch {
    return res.status(401).json({ message: MESSAGES.unauthorized });
  }
}

export async function requireManageUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as AuthedRequest).user;

  if (!user) {
    return res.status(401).json({ message: MESSAGES.unauthorized });
  }

  if (user.status === 'blocked') {
    return res.status(403).json({ message: MESSAGES.rightsLost });
  }

  return next();
}