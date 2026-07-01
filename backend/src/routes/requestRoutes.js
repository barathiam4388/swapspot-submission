import express from 'express';
import {
  createSwapRequest,
  deleteSwapRequest,
  getIncomingRequests,
  getSwapRequestById,
  getSwapRequests,
  updateSwapRequest
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/incoming', getIncomingRequests);
router.route('/').get(getSwapRequests).post(createSwapRequest);
router.route('/:id').get(getSwapRequestById).put(updateSwapRequest).delete(deleteSwapRequest);

export default router;
