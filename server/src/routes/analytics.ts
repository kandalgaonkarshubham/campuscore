import { Router } from 'express';
import { getOverview } from '../handlers/analytics';
import { requireAuth } from '../middleware/auth';
import { toRequestHandler } from '../lib/http';

const router = Router();

router.use(requireAuth);

router.get('/overview', toRequestHandler(getOverview));

export default router;
