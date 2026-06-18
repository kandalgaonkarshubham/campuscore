import { Router, type NextFunction, type Request, type Response } from 'express';
import { login, logout, me } from '../handlers/auth';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
