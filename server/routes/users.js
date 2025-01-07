import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { getStartingWeek } from '../utils/dates.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Get all users with their picks
router.get('/all', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        bullets: true,
        Picks: {
          select: {
            week: true,
            team: true,
            entryNumber: true,
          },
          orderBy: [{ week: 'asc' }, { entryNumber: 'asc' }],
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
