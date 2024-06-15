import express from 'express';
import { processDonation } from '../controllers/donationController';

const router = express.Router();

router.post('/donate', processDonation);

export default router;
