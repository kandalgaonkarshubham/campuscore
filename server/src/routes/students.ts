import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
  createStudent,
  deleteStudent,
  getFilterOptions,
  getStudent,
  listStudents,
  updateStudent,
} from '../handlers/students';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(requireAuth);

function withUpload(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      handler(req, res).catch(next);
    });
  };
}

router.post('/', withUpload(createStudent));
router.get('/meta', (req, res, next) => {
  getFilterOptions(req, res).catch(next);
});
router.get('/', (req, res, next) => {
  listStudents(req, res).catch(next);
});
router.get('/:id', (req, res, next) => {
  getStudent(req, res).catch(next);
});
router.put('/:id', withUpload(updateStudent));
router.delete('/:id', (req, res, next) => {
  deleteStudent(req, res).catch(next);
});

export default router;
