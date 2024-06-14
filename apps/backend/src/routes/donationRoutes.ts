import { Router } from 'express';
import { donateToOrg } from '../controllers/donationController';

const router = Router();

router.post('/donate', donateToOrg);

export default router;
