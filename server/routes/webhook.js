import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.js';

const router = express.Router();

// Stripe requires the raw body to construct the event
const rawBodyMiddleware = (req, res, next) => {
  if (req.method === 'POST') {
    let rawBody = '';
    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', () => {
      req.rawBody = rawBody;
      next();
    });
  } else {
    next();
  }
};

// POST /api/webhook
router.post('/', rawBodyMiddleware, handleStripeWebhook);

export default router;
