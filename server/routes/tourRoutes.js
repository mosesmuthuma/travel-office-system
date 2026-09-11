import express from 'express';
import { 
  getTours, 
  getTourById, 
  createTour, 
  updateTour, 
  deleteTour 
} from '../controllers/tourControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Adjust path to your auth middleware if needed

const router = express.Router();

// Routes for /api/tours
router.route('/')
  .get(getTours)
  .post(protect, admin, createTour);

// Routes for /api/tours/:id
router.route('/:id')
  .get(getTourById)
  .put(protect, admin, updateTour)
  .delete(protect, admin, deleteTour);

export default router;