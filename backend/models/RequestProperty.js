// models/RequestProperty.js
import mongoose from 'mongoose';

const requestPropertySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  propertyType: String,
  location: String,
  budget: Number,
  bedrooms: Number,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending',
  },
  responses: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    createdAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('RequestProperty', requestPropertySchema);