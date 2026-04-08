// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: String,
  contactInfo: {
    phone: String,
    email: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Booking', bookingSchema);