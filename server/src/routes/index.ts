import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: { status: 'ok' },
  });
});

router.use('/auth', authRoutes);

export default router;
