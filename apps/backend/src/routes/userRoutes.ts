import { Router } from 'express';
import { registerUser, authUser, getUserDetails } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.get('/details', authMiddleware, getUserDetails);

export default router;
