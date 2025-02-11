import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getAllUsers,
  getUser,
  // updatePushToken,
  // removePushToken,
  // sendTestNotification,
} from '../controllers/users.js';

const router = express.Router();

// GET /api/users - Get all users with their picks
router.get('/all', authenticateToken, getAllUsers);

// GET /api/users/:id - Get a single user with their picks
router.get('/:id', authenticateToken, getUser);

// router.post('/push-token', authenticateToken, updatePushToken);
// router.delete('/push-token', authenticateToken, removePushToken);
// router.post('/test-notification/:userId', sendTestNotification);

export default router;
