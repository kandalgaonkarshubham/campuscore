import { Router, type NextFunction, type Request, type Response } from 'express';
import { listLogs } from '../handlers/logs';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  listLogs(req, res).catch(next);
});

export default router;
