import { Router } from 'express';
import { getAnalyticsOverview } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/overview', (req, res, next) => {
  getAnalyticsOverview(req, res).catch(next);
});

export default router;
