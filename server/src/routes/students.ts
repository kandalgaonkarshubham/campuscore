import { Router } from 'express';
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
import { toRequestHandler } from '../lib/http';
import type { AppRequest, AppResponse, NextFn } from '../types/http';

const router = Router();

router.use(requireAuth);

type UploadMiddleware = (req: AppRequest, res: AppResponse, next: NextFn) => void;

function withUpload(handler: (req: AppRequest, res: AppResponse) => Promise<void>) {
  const invokeUpload = upload as unknown as UploadMiddleware;

  return toRequestHandler(async (req, res) => {
    await new Promise<void>((resolve, reject) => {
      invokeUpload(req, res, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    await handler(req, res);
  });
}

router.post('/', withUpload(createStudent));
router.get('/meta', toRequestHandler(getFilterOptions));
router.get('/', toRequestHandler(listStudents));
router.get('/:id', toRequestHandler(getStudent));
router.put('/:id', withUpload(updateStudent));
router.delete('/:id', toRequestHandler(deleteStudent));

export default router;
