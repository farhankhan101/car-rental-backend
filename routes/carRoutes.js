import express from 'express';
import { addCar, getAllCars, getCarsByUser, getCarById,updateCar, deleteCar } from '../controllers/carController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Public route to get all available cars
router.get('/', getAllCars);
router.get('/user',authenticate, authorize('Lister'), getCarsByUser);
router.get('/:id',authenticate, authorize('Lister','Renter'),getCarById)
// Protected routes for Lister role
router.post('/', authenticate, authorize('Lister'), upload.array('images', 5), addCar);
router.put('/:id', authenticate, authorize('Lister'), updateCar);
router.delete('/:id', authenticate, authorize('Lister'), deleteCar);

export default router;
