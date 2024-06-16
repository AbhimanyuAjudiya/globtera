import { Router } from 'express';
import { registerOrg, authOrg, getAllOrgs, createPost, getAllPosts, getPostById, getOrgDetails } from '../controllers/orgController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerOrg);
router.post('/auth', authOrg);
router.get('/all', getAllOrgs);
router.post('/post', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.get('/details', authMiddleware, getOrgDetails);

export default router;
