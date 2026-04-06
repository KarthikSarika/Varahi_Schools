import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        name: string;
    };
}

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const canPost = user.role === 'ADMIN' || user.role === 'TEACHER';

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/announcements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching announcements', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/announcements',
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            setContent('');
            setShowForm(false);
            fetchAnnouncements();
        } catch (err) {
            console.error('Error posting announcement', err);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>School Announcements</h2>
                {canPost && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Post New'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Create Announcement</h3>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Content</label>
                            <textarea
                                className="input"
                                style={{ height: '100px', resize: 'vertical' }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Publish</button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading announcements...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {announcements.map(ann => (
                        <div key={ann.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ color: 'var(--primary)' }}>{ann.title}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {new Date(ann.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', marginBottom: '1.5rem' }}>{ann.content}</p>
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Posted by {ann.author?.name || 'Admin'}
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            No announcements found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Announcements;
