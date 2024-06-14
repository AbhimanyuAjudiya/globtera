import { Router } from 'express';
import { registerOrg, authOrg, getAllOrgs } from '../controllers/orgController';

const router = Router();

router.post('/register', registerOrg);
router.post('/auth', authOrg);
router.get('/all', getAllOrgs);
export default router;
