import crypto from 'crypto';
import { Router } from 'express';
import {
  FRONTEND_URL,
  hashPassword,
  prisma,
  signToken,
  verifyPassword,
} from '../lib.js';
import { MESSAGES } from '../constants/messages.js';
import { sendVerificationEmail } from '../utils/mail.js';

const router = Router();

function parseRegisterBody(body: any) {
  return {
    name: String(body?.name || '').trim(),
    email: String(body?.email || '').trim().toLowerCase(),
    password: String(body?.password || '').trim(),
  };
}

function parseLoginBody(body: any) {
  return {
    email: String(body?.email || '').trim().toLowerCase(),
    password: String(body?.password || '').trim(),
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = parseRegisterBody(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: MESSAGES.registerFieldsRequired });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: MESSAGES.emailExists });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const passwordHash = await hashPassword(password);

    console.log('register start', email);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: 'unverified',
        verificationToken,
      },
    });

    console.log('user created', email);
    console.log('about to send verification email', email);

    await sendVerificationEmail(email, verificationToken);

    console.log('verification email sent', email);

    return res.json({
      message: MESSAGES.registrationSuccess,
    });
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).json({ message: MESSAGES.registrationFailed });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const token = String(req.query.token || '').trim();

    if (!token) {
      return res.status(400).send(MESSAGES.invalidToken);
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).send(MESSAGES.invalidToken);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: user.status === 'blocked' ? 'blocked' : 'active',
        emailVerifiedAt: new Date(),
        verificationToken: null,
      },
    });

    return res.redirect(`${FRONTEND_URL}/login?verified=1`);
  } catch (error) {
    console.error('verify-email error:', error);
    return res.status(500).send(MESSAGES.verificationFailed);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = parseLoginBody(req.body);

    if (!email || !password) {
      return res.status(400).json({ message: MESSAGES.loginFieldsRequired });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: MESSAGES.invalidCredentials });
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: MESSAGES.invalidCredentials });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: MESSAGES.blockedAccount });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastActivityAt: new Date(),
      },
    });

    const token = signToken({
      sub: updatedUser.id,
      email: updatedUser.email,
    });

    return res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: MESSAGES.loginFailed });
  }
});

export default router;