import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Class {
    id: string;
    name: string;
    section: string;
}

interface Student {
    id: string;
    name: string;
}

const TeacherAttendance: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<Record<string, string>>({});

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/teacher/classes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(res.data);
            } catch (err) {
                console.error('Error fetching classes', err);
            }
        };
        fetchClasses();
    }, [token]);

    useEffect(() => {
        if (selectedClass) {
            const fetchStudents = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/teacher/classes/${selectedClass}/students`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStudents(res.data);
                    const initialAttendance: Record<string, string> = {};
                    res.data.forEach((s: Student) => initialAttendance[s.id] = 'PRESENT');
                    setAttendance(initialAttendance);
                } catch (err) {
                    console.error('Error fetching students', err);
                }
            };
            fetchStudents();
        }
    }, [selectedClass, token]);

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
        }));

        try {
            await axios.post('http://localhost:5000/api/teacher/attendance', {
                classId: selectedClass,
                date,
                attendanceData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Attendance marked successfully!');
        } catch (err) {
            console.error('Error saving attendance', err);
        }
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Mark Attendance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Class</label>
                        <select className="input" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">-- Choose Class --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </div>
            </div>

            {selectedClass && (
                <div className="card" style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Student Name</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Present</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Absent</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Late</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{student.name}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <input type="radio" name={student.id} checked={attendance[student.id] === 'PRESENT'} onChange={() => handleStatusChange(student.id, 'PRESENT')} />
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <input type="radio" name={student.id} checked={attendance[student.id] === 'ABSENT'} onChange={() => handleStatusChange(student.id, 'ABSENT')} />
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <input type="radio" name={student.id} checked={attendance[student.id] === 'LATE'} onChange={() => handleStatusChange(student.id, 'LATE')} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                        <button className="btn btn-primary" onClick={handleSubmit}>Submit Attendance</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
