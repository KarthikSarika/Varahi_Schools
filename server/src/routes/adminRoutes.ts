import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { getAllUsers, createTeacher, createStudent, getTeachers, getStudents, getClasses, createClass, getAnnouncements, createAnnouncement, deleteTeacher, deleteStudent, deleteClass, editTeacher, editStudent, editClass } from '../controllers/adminController';

const router = express.Router();

router.get('/users', authenticate, authorize([Role.ADMIN]), getAllUsers);
router.get('/teachers', authenticate, authorize([Role.ADMIN]), getTeachers);
router.post('/teachers', authenticate, authorize([Role.ADMIN]), createTeacher);
router.get('/students', authenticate, authorize([Role.ADMIN]), getStudents);
router.post('/students', authenticate, authorize([Role.ADMIN]), createStudent);
router.get('/classes', authenticate, authorize([Role.ADMIN]), getClasses);
router.post('/classes', authenticate, authorize([Role.ADMIN]), createClass);
router.put('/classes/:id', authenticate, authorize([Role.ADMIN]), editClass);

router.delete('/teachers/:id', authenticate, authorize([Role.ADMIN]), deleteTeacher);
router.put('/teachers/:id', authenticate, authorize([Role.ADMIN]), editTeacher);

router.delete('/students/:id', authenticate, authorize([Role.ADMIN]), deleteStudent);
router.put('/students/:id', authenticate, authorize([Role.ADMIN]), editStudent);

router.delete('/classes/:id', authenticate, authorize([Role.ADMIN]), deleteClass);
router.get('/announcements', authenticate, getAnnouncements);
router.post('/announcements', authenticate, authorize([Role.ADMIN, Role.TEACHER]), createAnnouncement);

export default router;
