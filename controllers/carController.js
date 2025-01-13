import Car from '../models/Car.js';

// Add a new car
export const addCar = async (req, res) => {
  try {
    const { make, model, year, price } = req.body;

    // Ensure files are uploaded
    const images = req.files?.map(file => file.path) || [];

    const car = new Car({
      make,
      model,
      year,
      price,
      availability: true,
      images,
      listedBy: req.user.id, // Assuming `req.user` contains the authenticated user's ID
    });

    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: 'Failed to add car', details: err.message });
  }
};

// Get all cars (for Renters)
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ availability: true });
    res.status(200).json(cars);
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: 'Failed to fetch cars', details: err.message });
  }
};

// Get cars listed by the authenticated user
export const getCarsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
    const cars = await Car.find({ listedBy: userId });

    if (!cars.length) {
      return res.status(404).json({ message: 'No cars found for this user' });
    }

    res.status(200).json(cars);
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: 'Failed to fetch user cars', details: err.message });
  }
};


// Update car details (for Listers)
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the car by ID and ensure the user is the lister
    const car = await Car.findOne({ _id: id, listedBy: req.user.id });

    if (!car) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    // Update car fields from request body
    Object.assign(car, req.body);

    // Handle file uploads if provided
    if (req.files?.length > 0) {
      const images = req.files.map(file => file.path);
      car.images = images;
    }

    await car.save();
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: 'Failed to update car', details: err.message });
  }
};

// Delete a car (for Listers)
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the car
    const car = await Car.findOneAndDelete({ _id: id, listedBy: req.user.id });

    if (!car) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    console.error(err); // Log for debugging
    res.status(500).json({ error: 'Failed to delete car', details: err.message });
  }
};
