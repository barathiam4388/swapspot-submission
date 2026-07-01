import express from 'express';
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/:id').get(getListingById).put(protect, updateListing).delete(protect, deleteListing);

export default router;
