import { PrismaClient } from '@prisma/client';
import stripe from '../utils/stripe.js';

const prisma = new PrismaClient();

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.rawBody;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('PAYMENT SUCCESSFUL CUH');
        const session = event.data.object;

        const userId = parseInt(session.metadata.userId);
        const quantity = parseInt(session.metadata.quantity);

        console.log('session.payment_status:', session.payment_status);
        console.log('SESSION:', session);
        console.log({ userId, quantity });

        try {
          await prisma.checkout.create({
            data: {
              userId,
              quantity,
              stripeCheckoutId: session.id,
            },
          });

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              bullets: {
                increment: quantity,
              },
            },
          });
        } catch (error) {
          console.error('Database operation failed:', error);
          return res.status(500).json({ error: error.message });
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error in webhook handler:', err);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};
