// routes/paymentRoutes.js
import express from 'express';
import {
  placeOrderStripe,
  verifyStripe,
} from '../controllers/paymentController';

const router = express.Router();

// Route to place order and initiate Stripe payment
router.post('/place-order', placeOrderStripe);

// Route to verify payment status
router.post('/verify-payment', verifyStripe);

export default router;
