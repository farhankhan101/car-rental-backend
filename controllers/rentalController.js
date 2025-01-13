import Rental from '../models/Rental.js';
import Car from '../models/Car.js';

// Rent a car
export const rentCar = async (req, res) => {
  try {
    const { carId, startDate, endDate, contactInfo } = req.body;

    // Check car availability
    const car = await Car.findById(carId);
    if (!car || !car.availability) {
      return res.status(400).json({ message: 'Car not available' });
    }

    // Create a new rental
    const rental = new Rental({
      car: carId,
      renter: req.user.id,
      startDate,
      endDate,
      contactInfo,
      paymentStatus: 'Pending',
    });

    // Update car availability
    car.availability = false;

    // Save rental and car updates
    await Promise.all([rental.save(), car.save()]);

    res.status(201).json({ message: 'Car rented successfully', rental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get rentals (Renter or Lister)
export const getRentals = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let rentals;

    if (role === 'Renter' ) {
      // Fetch rentals for the current renter
      rentals = await Rental.find({ renter: userId }).populate('car');
    } else if (role === 'Lister') {
      // Fetch rentals for cars listed by the current lister
      const cars = await Car.find({ listerId: userId }).select('_id');
      const carIds = cars.map(car => car._id);

      rentals = await Rental.find({ car: { $in: carIds } }).populate('car');
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(200).json(rentals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update rental status
export const updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find rental by ID and update status
    const rental = await Rental.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    );

    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', rental });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
