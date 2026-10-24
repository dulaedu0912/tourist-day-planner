import { Router } from 'express';
import * as places from '../controllers/placeController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Public (tourist) routes
router.get('/', asyncHandler(places.list));
router.get('/:id', asyncHandler(places.getOne));

export default router;
