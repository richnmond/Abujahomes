// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  images: [{
    url: String,
    publicId: String,
  }],
  propertyType: {
    type: String,
    enum: ['Apartment', 'Land', 'Duplex', 'Short-let'],
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  area: Number,
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Property', propertySchema);