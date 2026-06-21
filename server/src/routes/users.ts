import { Router } from 'express';
import { prisma } from '../lib.js';
import { MESSAGES } from '../constants/messages.js';
import { requireAuth, requireManageUsers } from '../middleware/auth.js';
import { parseIds } from '../utils/users.js';
import { UserStatus } from '@prisma/client';

const router = Router();

router.use(requireAuth);
router.use(requireManageUsers);

function getIds(body: any) {
  return parseIds(body?.ids);
}

function ensureIds(ids: string[], res: any) {
  if (!ids.length) {
    res.status(400).json({ message: MESSAGES.noUsersSelected });
    return false;
  }

  return true;
}

router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        lastLoginAt: true,
      },
      orderBy: {
        lastLoginAt: {
          sort: 'desc',
          nulls: 'last',
        },
      },
    });

    return res.json(users);
  } catch (error) {
    console.error('users list error:', error);
    return res.status(500).json({ message: MESSAGES.usersLoadFailed });
  }
});

router.post('/block', async (req, res) => {
  try {
    const ids = getIds(req.body);

    if (!ensureIds(ids, res)) return;

    await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          status: true,
          blockedFromStatus: true,
        },
      });

      for (const user of users) {
        if (user.status === 'blocked') {
          continue;
        }

        await tx.user.update({
          where: { id: user.id },
          data: {
            blockedFromStatus: user.status,
            status: 'blocked',
          },
        });
      }
    });

    return res.json({ message: MESSAGES.usersBlocked });
  } catch (error) {
    console.error('block users error:', error);
    return res.status(500).json({ message: MESSAGES.actionFailed });
  }
});

router.post('/unblock', async (req, res) => {
  try {
    const ids = getIds(req.body);

    if (!ensureIds(ids, res)) return;

    await prisma.$transaction(async (tx) => {
      const users = await tx.user.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          blockedFromStatus: true,
        },
      });

      for (const user of users) {
        const restoredStatus = user.blockedFromStatus ?? UserStatus.active;
        await tx.user.update({
          where: { id: user.id },
          data: {
            status: restoredStatus,
            blockedFromStatus: null,
          },
        });
      }
    });

    return res.json({ message: MESSAGES.usersUnblocked });
  } catch (error) {
    console.error('unblock users error:', error);
    return res.status(500).json({ message: MESSAGES.actionFailed });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const ids = getIds(req.body);

    if (!ensureIds(ids, res)) return;

    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return res.json({ message: MESSAGES.usersDeleted });
  } catch (error) {
    console.error('delete users error:', error);
    return res.status(500).json({ message: MESSAGES.actionFailed });
  }
});

router.post('/delete-unverified', async (req, res) => {
  try {
    const ids = getIds(req.body);

    if (!ensureIds(ids, res)) return;

    await prisma.user.deleteMany({
      where: {
        id: { in: ids },
        status: 'unverified',
      },
    });

    return res.json({ message: MESSAGES.unverifiedUsersDeleted });
  } catch (error) {
    console.error('delete unverified users error:', error);
    return res.status(500).json({ message: MESSAGES.actionFailed });
  }
});

export default router;