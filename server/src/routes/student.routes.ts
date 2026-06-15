import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
} from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadPhoto } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

function withOptionalPhoto(
  handler: (req: Request, res: Response) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadPhoto(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      handler(req, res).catch(next);
    });
  };
}

router.post('/', withOptionalPhoto(createStudent));
router.get('/:id', (req, res, next) => {
  getStudent(req, res).catch(next);
});
router.put('/:id', withOptionalPhoto(updateStudent));
router.delete('/:id', (req, res, next) => {
  deleteStudent(req, res).catch(next);
});

export default router;
