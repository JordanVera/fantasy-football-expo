import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.js';

const router = express.Router();

// Register endpoint - will be accessed at /api/auth/signup
router.post('/signup', signup);

// Login endpoint - will be accessed at /api/auth/login
router.post('/login', login);

// Forgot password endpoint
router.post('/forgot-password', forgotPassword);

// Reset password endpoint
router.post('/reset-password', resetPassword);

export default router;
