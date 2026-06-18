import { Router } from 'express';
import { getOverview } from '../handlers/analytics';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/overview', (req, res, next) => {
  getOverview(req, res).catch(next);
});

export default router;
