import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getStudentOverview = async (req: AuthRequest, res: Response) => {
    if (!req.user || (req.user.role !== 'STUDENT' && req.user.role !== 'PARENT')) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        let studentId: string | undefined;

        if (req.user.role === 'STUDENT') {
            const student = await prisma.student.findUnique({ where: { userId: req.user.id } });
            studentId = student?.id;
        } else if (req.user.role === 'PARENT') {
            const parent = await prisma.parent.findUnique({
                where: { userId: req.user.id },
                include: { students: true }
            });
            studentId = parent?.students[0]?.id;
        }

        if (!studentId) return res.status(404).json({ message: 'Student not found' });

        const studentData = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                class: true,
                attendance: { take: 10, orderBy: { date: 'desc' } },
                marks: { take: 5, orderBy: { date: 'desc' }, include: { subject: true } }
            }
        });

        const attendanceCount = await prisma.attendance.groupBy({
            by: ['status'],
            where: { studentId: studentId },
            _count: true
        });

        res.json({
            profile: studentData,
            attendanceSummary: attendanceCount
        });
    } catch (error) {
        console.error('Error in getStudentOverview:', error);
        res.status(500).json({ message: 'Error fetching student overview' });
    }
};

export const getStudentMarks = async (req: AuthRequest, res: Response) => {
    const { studentId } = req.params;
    try {
        const marks = await prisma.mark.findMany({
            where: { studentId },
            include: { subject: true },
            orderBy: { date: 'desc' }
        });
        res.json(marks);
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: 'Error fetching marks' });
    }
};

export const getFeeStatus = async (req: AuthRequest, res: Response) => {
    const { studentId } = req.params;
    try {
        const fees = await prisma.feePayment.findMany({
            where: { studentId },
            include: { feeStructure: true }
        });
        res.json(fees);
    } catch (error) {
        console.error('Error fetching fee status:', error);
        res.status(500).json({ message: 'Error fetching fee status' });
    }
};
