import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

// Mounted at /api, so the full path is POST /api/login
router.post('/login', asyncHandler(login));

export default router;
