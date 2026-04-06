import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Class {
    id: string;
    name: string;
    section: string;
    _count?: {
        students: number;
    };
}

const AdminClasses: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/classes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClasses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching classes', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleEdit = (cls: Class) => {
        setName(cls.name);
        setSection(cls.section);
        setEditingId(cls.id);
        setShowForm(true);
    };

    const handleCancel = () => {
        setName('');
        setSection('');
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/admin/classes/${editingId}`,
                    { name, section },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post('http://localhost:5000/api/admin/classes',
                    { name, section },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            handleCancel();
            fetchClasses();
        } catch (error) {
            console.error('Error saving class', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this class?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/classes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Classes</h2>
                <button className="btn btn-primary" onClick={() => showForm ? handleCancel() : setShowForm(true)}>
                    {showForm ? 'Cancel' : 'Add Class'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>{editingId ? 'Edit Class' : 'Add New Class'}</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Class Name (e.g. Class 10)</label>
                                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Section (e.g. A)</label>
                                <input className="input" value={section} onChange={(e) => setSection(e.target.value)} required />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">{editingId ? 'Save Edits' : 'Save Class'}</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading classes...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {classes.map((cls) => (
                        <div key={cls.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ color: 'var(--primary)' }}>{cls.name}</h3>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Section {cls.section}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleEdit(cls)}>Edit</button>
                                    <button className="btn" style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(cls.id)}>Delete</button>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {cls._count?.students || 0} Students enrolled
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No classes created yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminClasses;
