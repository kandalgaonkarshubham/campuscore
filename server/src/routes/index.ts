import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: { status: 'ok' },
  });
});

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);

export default router;
