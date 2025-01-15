import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createPicks } from '../controllers/picks.js';

const router = express.Router();

// POST /api/picks
router.post('/', authenticateToken, createPicks);

export default router;
