import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  contactInfo: {
    phone: { type: String, required: true }, // or type: String if you want to allow other formats
    email: { type: String, required: true }
  },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;
