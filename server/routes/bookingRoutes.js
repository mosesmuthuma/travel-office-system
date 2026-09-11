import express from 'express';
import { getMyBookings, createBooking, deleteBooking } from '../controllers/bookingControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyBookings)
  .post(protect, createBooking);

router.route('/:id')
  .delete(protect, deleteBooking);

export default router;