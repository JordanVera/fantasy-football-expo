import express from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { getAvailableWeeks, getStartingWeek } from '../utils/dates.js';

const router = express.Router();

// GET /api/dates
router.get('/available', (req, res) => {
  const weeks = getAvailableWeeks();
  res.json({ weeks });
});

router.get('/starting', (req, res) => {
  const startingWeek = getStartingWeek();
  res.json({ startingWeek });
});

export default router;
