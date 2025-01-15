import express from 'express';
import { signup, login } from '../controllers/auth.js';

const router = express.Router();

// Register endpoint - will be accessed at /api/auth/signup
router.post('/signup', signup);

// Login endpoint - will be accessed at /api/auth/login
router.post('/login', login);

export default router;
