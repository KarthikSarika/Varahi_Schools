import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { getAssignedClasses, getStudentsByClass, markAttendance, enterMarks } from '../controllers/teacherController';

const router = express.Router();

router.get('/classes', authenticate, authorize([Role.TEACHER]), getAssignedClasses);
router.get('/classes/:classId/students', authenticate, authorize([Role.TEACHER]), getStudentsByClass);
router.post('/attendance', authenticate, authorize([Role.TEACHER]), markAttendance);
router.post('/marks', authenticate, authorize([Role.TEACHER]), enterMarks);

export default router;
