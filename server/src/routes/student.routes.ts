import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
} from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', (req, res, next) => {
  createStudent(req, res).catch(next);
});

router.get('/:id', (req, res, next) => {
  getStudent(req, res).catch(next);
});

router.put('/:id', (req, res, next) => {
  updateStudent(req, res).catch(next);
});

router.delete('/:id', (req, res, next) => {
  deleteStudent(req, res).catch(next);
});

export default router;
