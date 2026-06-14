import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: { status: 'ok' },
  });
});

export default router;
