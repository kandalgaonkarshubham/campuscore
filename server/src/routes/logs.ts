import { Router } from 'express';
import { listLogs } from '../handlers/logs';
import { requireAuth } from '../middleware/auth';
import { toRequestHandler } from '../lib/http';

const router = Router();

router.use(requireAuth);

router.get('/', toRequestHandler(listLogs));

export default router;
