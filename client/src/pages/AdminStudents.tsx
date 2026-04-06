import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Student {
    id: string;
    name: string;
    user: {
        email: string;
    };
    class: {
        id: string;
        name: string;
        section: string;
    };
}

interface Class {
    id: string;
    name: string;
    section: string;
}

const AdminStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [classId, setClassId] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        try {
            const [studentsRes, classesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/admin/classes', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStudents(studentsRes.data);
            setClasses(classesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (student: Student) => {
        setName(student.name);
        setEmail(student.user.email);
        setPassword('');
        setClassId(student.class?.id || '');
        setEditingId(student.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setName('');
        setEmail('');
        setPassword('');
        setClassId('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/admin/students/${editingId}`,
                    { name, email, password, classId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post('http://localhost:5000/api/admin/students',
                    { name, email, password, classId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            handleCancel();
            fetchData();
        } catch (error) {
            console.error('Error saving student', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Error deleting student', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Students</h2>
                <button className="btn btn-primary" onClick={() => showForm ? handleCancel() : setShowForm(true)}>
                    {showForm ? 'Cancel' : 'Add Student'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password {editingId && <span style={{ color: 'var(--text-muted)' }}>(Leave blank to keep current)</span>}</label>
                                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required={!editingId} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Class</label>
                                <select className="input" value={classId} onChange={(e) => setClassId(e.target.value)} required>
                                    <option value="">Select Class</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} - {c.section}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">{editingId ? 'Save Edits' : 'Save Student'}</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading students...</p>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Class</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem', width: '100px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{student.name}</td>
                                    <td style={{ padding: '1rem' }}>{student.class?.name} - {student.class?.section}</td>
                                    <td style={{ padding: '1rem' }}>{student.user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleEdit(student)}>Edit</button>
                                            <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(student.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
