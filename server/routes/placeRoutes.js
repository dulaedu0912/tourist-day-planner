import { Router } from 'express';
import * as places from '../controllers/placeController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Public (tourist) routes
router.get('/', asyncHandler(places.list));
router.get('/:id', asyncHandler(places.getOne));

// Admin-only routes (FR-032)
router.post('/', requireAuth, asyncHandler(places.create));
router.put('/:id', requireAuth, asyncHandler(places.update));
router.delete('/:id', requireAuth, asyncHandler(places.remove));

export default router;
