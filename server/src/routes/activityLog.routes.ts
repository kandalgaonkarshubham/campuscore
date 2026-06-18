import { Router } from 'express';
import { listActivityLogs } from '../controllers/activityLog.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => {
  listActivityLogs(req, res).catch(next);
});

export default router;
