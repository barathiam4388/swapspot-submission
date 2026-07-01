import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'fair'],
      default: 'good'
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'swapped'],
      default: 'available'
    },
    campusLocation: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
