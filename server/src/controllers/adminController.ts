import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            include: {
                teacher: true,
                student: true,
                parent: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getTeachers = async (req: AuthRequest, res: Response) => {
    try {
        const teachers = await prisma.teacher.findMany({
            where: { isDeleted: false },
            include: { user: { select: { email: true } } }
        });
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Error fetching teachers' });
    }
};

export const createTeacher = async (req: AuthRequest, res: Response) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: Role.TEACHER,
                teacher: {
                    create: { name }
                }
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ message: 'Error creating teacher' });
    }
};

export const getStudents = async (req: AuthRequest, res: Response) => {
    try {
        const students = await prisma.student.findMany({
            where: { isDeleted: false },
            include: {
                user: { select: { email: true } },
                class: true
            }
        });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
};

export const createStudent = async (req: AuthRequest, res: Response) => {
    const { email, password, name, classId } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: Role.STUDENT,
                student: {
                    create: {
                        name,
                        classId
                    }
                }
            },
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
};

export const getClasses = async (req: AuthRequest, res: Response) => {
    try {
        const classes = await prisma.class.findMany({
            where: { isDeleted: false },
            include: { _count: { select: { students: true } } }
        });
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ message: 'Error fetching classes' });
    }
};

export const createClass = async (req: AuthRequest, res: Response) => {
    const { name, section } = req.body;
    try {
        const newClass = await prisma.class.create({
            data: { name, section }
        });
        res.status(201).json(newClass);
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ message: 'Error creating class' });
    }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
    const { title, content, role, classId } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const teacher = await prisma.teacher.findUnique({ where: { userId: req.user.id } });

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                role: (role as Role) || null,
                classId: classId || null,
                authorId: teacher?.id || null
            }
        });
        res.status(201).json(announcement);
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Error creating announcement' });
    }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { name: true } } }
        });
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Error fetching announcements' });
    }
};

export const deleteTeacher = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        
        await prisma.$transaction([
            prisma.teacher.update({ where: { id }, data: { isDeleted: true } }),
            prisma.user.update({ where: { id: teacher.userId }, data: { isDeleted: true } })
        ]);
        
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: 'Error deleting teacher' });
    }
};

export const deleteStudent = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        await prisma.$transaction([
            prisma.student.update({ where: { id }, data: { isDeleted: true } }),
            prisma.user.update({ where: { id: student.userId }, data: { isDeleted: true } })
        ]);

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student' });
    }
};

export const deleteClass = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.class.update({ where: { id }, data: { isDeleted: true } });
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ message: 'Error deleting class' });
    }
};

export const editTeacher = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const teacher = await prisma.teacher.findUnique({ where: { id }, include: { user: true } });
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

        let updateData: any = { email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.$transaction([
            prisma.teacher.update({ where: { id }, data: { name } }),
            prisma.user.update({ where: { id: teacher.userId }, data: updateData })
        ]);

        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error('Error editing teacher:', error);
        res.status(500).json({ message: 'Error editing teacher' });
    }
};

export const editStudent = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, password, classId } = req.body;
    try {
        const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        let updateData: any = { email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await prisma.$transaction([
            prisma.student.update({ where: { id }, data: { name, classId } }),
            prisma.user.update({ where: { id: student.userId }, data: updateData })
        ]);

        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error editing student:', error);
        res.status(500).json({ message: 'Error editing student' });
    }
};

export const editClass = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, section } = req.body;
    try {
        await prisma.class.update({ where: { id }, data: { name, section } });
        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error editing class:', error);
        res.status(500).json({ message: 'Error editing class' });
    }
};
