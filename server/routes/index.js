import express from 'express';
import authRoutes from './auth.js';
import picksRoutes from './picks.js';
import usersRoutes from './users.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  console.log('Hello World');
  res.status(200).json({ message: 'Hello World' });
});

// Mount auth routes
router.use('/auth', authRoutes);
router.use('/picks', picksRoutes);
router.use('/users', usersRoutes);

export default router;
