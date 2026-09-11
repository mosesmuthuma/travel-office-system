import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config(); // Ensures environment variables are loaded

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { tourName, price, guests, location } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: tourName,
              description: `Location: ${location} | Guests: ${guests}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: guests || 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/bookings?success=true`,
      cancel_url: `${req.headers.origin}/bookings?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};