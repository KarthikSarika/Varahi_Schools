import { Response } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getAssignedClasses = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'TEACHER') return res.status(403).json({ message: 'Forbidden' });

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { userId: req.user.id },
            include: {
                subjects: {
                    include: {
                        timetable: {
                            include: {
                                class: true
                            }
                        }
                    }
                }
            }
        });

        // Extract unique classes assigned to this teacher
        const classes = teacher?.subjects.flatMap((s: any) => s.timetable.map((t: any) => t.class)) || [];
        const uniqueClasses = Array.from(new Set(classes.map((c: any) => c.id))).map(id => classes.find((c: any) => c.id === id));

        res.json(uniqueClasses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned classes' });
    }
};

export const getStudentsByClass = async (req: AuthRequest, res: Response) => {
    const { classId } = req.params;
    try {
        const students = await prisma.student.findMany({
            where: { classId },
            include: { user: { select: { email: true } } }
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
};

export const markAttendance = async (req: AuthRequest, res: Response) => {
    const { classId, date, attendanceData } = req.body; // attendanceData: [{studentId, status}]
    try {
        const records = await Promise.all(
            attendanceData.map((data: any) =>
                prisma.attendance.create({
                    data: {
                        date: new Date(date),
                        status: data.status,
                        studentId: data.studentId,
                        classId: classId
                    }
                })
            )
        );
        res.status(201).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance' });
    }
};

export const enterMarks = async (req: AuthRequest, res: Response) => {
    const { subjectId, type, marksData } = req.body; // marksData: [{studentId, score}]
    try {
        const records = await Promise.all(
            marksData.map((data: any) =>
                prisma.mark.create({
                    data: {
                        score: parseFloat(data.score),
                        type: type,
                        studentId: data.studentId,
                        subjectId: subjectId
                    }
                })
            )
        );
        res.status(201).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error entering marks' });
    }
};
