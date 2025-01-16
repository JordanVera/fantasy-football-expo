import stripe from '../utils/stripe.js';

export const createCheckoutSession = async (req, res) => {
  try {
    const { lineItems } = req.body;
    const userId = req.user.id; // From auth middleware

    console.log('line items:', lineItems);

    // Create a Customer
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
      },
    });

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: lineItems[0].price_data.unit_amount * lineItems[0].quantity,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId,
        quantity: lineItems[0].quantity,
      },
    });

    // Create an Ephemeral Key for the Customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.log('Error:', error);
    console.log('Error message:', error.message);
    res.status(500).json({ error: error.message });
  }
};
