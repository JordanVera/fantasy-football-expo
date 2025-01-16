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
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment Intent Succeeded:', paymentIntent.id);

        const userId = parseInt(paymentIntent.metadata.userId);
        const quantity = parseInt(paymentIntent.metadata.quantity);

        console.log('Processing payment for user:', { userId, quantity });

        try {
          // Create checkout record
          await prisma.checkout.create({
            data: {
              userId,
              quantity,
              stripePaymentIntentId: paymentIntent.id,
            },
          });

          // Update user's bullets
          const updatedUser = await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              bullets: {
                increment: quantity,
              },
            },
          });

          console.log('Successfully updated user bullets:', updatedUser);
        } catch (error) {
          console.error('Database operation failed:', error);
          // Don't return here, we still want to send 200 to Stripe
          // Just log the error and continue
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always return a 200 to Stripe
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error in webhook handler:', err);
    // Still return 200 to prevent Stripe from retrying
    return res.status(200).json({ received: true, error: err.message });
  }
};
