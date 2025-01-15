import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getLosers } from '../controllers/losers.js';

const router = express.Router();

// GET /api/losers
router.get('/', authenticateToken, getLosers);

export default router;
