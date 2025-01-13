import express from 'express';
import { rentCar, getRentals, updateRentalStatus } from '../controllers/rentalController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route for Renters
router.post('/', authenticate, authorize('Renter'), rentCar);

// Get all rentals for the current user
router.get('/', authenticate, getRentals);

router.put('/:id/status', authenticate, authorize('Renter', 'Lister'), updateRentalStatus);

export default router;
