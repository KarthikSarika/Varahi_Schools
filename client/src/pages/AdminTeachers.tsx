import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;


interface Teacher {
    id: string;
    name: string;
    user: {
        email: string;
    };
}

const AdminTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/teachers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teachers', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleEdit = (teacher: Teacher) => {
        setName(teacher.name);
        setEmail(teacher.user.email);
        setPassword('');
        setEditingId(teacher.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setName('');
        setEmail('');
        setPassword('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/admin/teachers/${editingId}`,
                    { name, email, password },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(`${API_URL}/api/admin/teachers`,
                    { name, email, password },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            handleCancel();
            fetchTeachers();
        } catch (error) {
            console.error('Error saving teacher', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;
        try {
            await axios.delete(`${API_URL}/api/admin/teachers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Teachers</h2>
                <button className="btn btn-primary" onClick={() => showForm ? handleCancel() : setShowForm(true)}>
                    {showForm ? 'Cancel' : 'Add Teacher'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>{editingId ? 'Edit Teacher' : 'Add New Teacher'}</h3>
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
                        </div>
                        <button type="submit" className="btn btn-primary">{editingId ? 'Save Edits' : 'Save Teacher'}</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading teachers...</p>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>ID</th>
                                <th style={{ padding: '1rem', width: '100px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{teacher.name}</td>
                                    <td style={{ padding: '1rem' }}>{teacher.user.email}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{teacher.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleEdit(teacher)}>Edit</button>
                                            <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(teacher.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No teachers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminTeachers;
