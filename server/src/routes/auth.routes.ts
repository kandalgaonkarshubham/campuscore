import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', (req, res, next) => {
  login(req, res).catch(next);
});

router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
