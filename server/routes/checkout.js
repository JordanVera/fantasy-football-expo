import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCheckoutSession } from '../controllers/checkout.js';

const router = express.Router();

// POST /api/checkout
router.post('/', authenticateToken, createCheckoutSession);

export default router;
