import { Router } from 'express';
import { listLogs } from '../handlers/logs';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => {
  listLogs(req, res).catch(next);
});

export default router;
