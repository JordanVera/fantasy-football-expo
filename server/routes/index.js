import express from 'express';
import authRoutes from './auth.js';
import picksRoutes from './picks.js';
import usersRoutes from './users.js';
import losersRoutes from './losers.js';
import datesRoutes from './dates.js';
import checkoutRoutes from './checkout.js';
import webhookRoutes from './webhook.js';

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
router.use('/losers', losersRoutes);
router.use('/dates', datesRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/webhook', webhookRoutes);

export default router;
