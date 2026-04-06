import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


interface Class {
    id: string;
    name: string;
    section: string;
}

interface Student {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
}

const TeacherMarks: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [examType, setExamType] = useState('MIDTERM');
    const [marks, setMarks] = useState<Record<string, string>>({});

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/teacher/classes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(res.data);
            } catch (err) {
                console.error('Error fetching classes', err);
            }
        };
        fetchClasses();

        setSubjects([
            { id: 'math-101', name: 'Mathematics' },
            { id: 'sci-102', name: 'Science' }
        ]);
    }, [token]);

    useEffect(() => {
        if (selectedClass) {
            const fetchStudents = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/teacher/classes/${selectedClass}/students`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStudents(res.data);
                    const initialMarks: Record<string, string> = {};
                    res.data.forEach((s: Student) => initialMarks[s.id] = '');
                    setMarks(initialMarks);
                } catch (err) {
                    console.error('Error fetching students', err);
                }
            };
            fetchStudents();
        }
    }, [selectedClass, token]);

    const handleMarkChange = (studentId: string, score: string) => {
        setMarks(prev => ({ ...prev, [studentId]: score }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const marksData = Object.entries(marks).map(([studentId, score]) => ({
            studentId,
            score
        }));

        try {
            await axios.post(`${API_URL}/api/teacher/marks`, {
                subjectId: selectedSubject,
                type: examType,
                marksData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Marks entered successfully!');
        } catch (err) {
            console.error('Error saving marks', err);
        }
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Enter Student Marks</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Class</label>
                        <select className="input" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                            <option value="">-- Choose Class --</option>
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} - {c.section}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Subject</label>
                        <select className="input" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                            <option value="">-- Choose Subject --</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Exam Type</label>
                        <select className="input" value={examType} onChange={(e) => setExamType(e.target.value)}>
                            <option value="MIDTERM">Mid-term</option>
                            <option value="FINAL">Final Exam</option>
                            <option value="ASSIGNMENT">Assignment</option>
                            <option value="QUIZ">Quiz</option>
                        </select>
                    </div>
                </div>
            </div>

            {selectedClass && selectedSubject && (
                <div className="card" style={{ padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Student Name</th>
                                <th style={{ padding: '1rem', textAlign: 'right', width: '200px' }}>Score / 100</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{student.name}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <input
                                            type="number"
                                            className="input"
                                            style={{ width: '100px', textAlign: 'center' }}
                                            value={marks[student.id]}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            placeholder="0-100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                        <button className="btn btn-primary" onClick={handleSubmit}>Save Marks</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherMarks;
