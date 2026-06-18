import { Router } from 'express';
import activityLogRoutes from './activityLog.routes';
import analyticsRoutes from './analytics.routes';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    data: { status: 'ok' },
  });
});

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: { status: 'ok' },
  });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/activity-logs', activityLogRoutes);

export default router;
