import { Router } from 'express';
import analytics from './analytics';
import auth from './auth';
import logs from './logs';
import students from './students';
import { toSyncRequestHandler } from '../lib/http';
import type { AppRequest, AppResponse } from '../types/http';

const router = Router();

router.get(
  '/health',
  toSyncRequestHandler((_req: AppRequest, res: AppResponse) => {
    res.json({
      success: true,
      message: 'OK',
      data: { status: 'ok' },
    });
  }),
);

router.use('/auth', auth);
router.use('/students', students);
router.use('/analytics', analytics);
router.use('/activity-logs', logs);

export default router;
