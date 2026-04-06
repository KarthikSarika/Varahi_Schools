import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { getStudentOverview, getStudentMarks, getFeeStatus } from '../controllers/studentController';

const router = express.Router();

router.get('/overview', authenticate, authorize([Role.STUDENT, Role.PARENT]), getStudentOverview);
router.get('/:studentId/marks', authenticate, authorize([Role.STUDENT, Role.PARENT, Role.TEACHER, Role.ADMIN]), getStudentMarks);
router.get('/:studentId/fees', authenticate, authorize([Role.STUDENT, Role.PARENT, Role.ADMIN]), getFeeStatus);

export default router;
