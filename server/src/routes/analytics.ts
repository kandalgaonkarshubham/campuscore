import { Router, type NextFunction, type Request, type Response } from 'express';
import { getOverview } from '../handlers/analytics';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/overview', (req: Request, res: Response, next: NextFunction) => {
  getOverview(req, res).catch(next);
});

export default router;
