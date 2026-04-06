import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;


interface StudentProfile {
    name: string;
    class: {
        name: string;
        section: string;
    };
    marks: any[];
    attendance: any[];
}

const StudentPortal: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/student/overview`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching student overview', err);
                setLoading(false);
            }
        };
        fetchOverview();
    }, [token]);

    if (loading) return <div>Loading portal...</div>;
    if (!data) return <div>Error loading data.</div>;

    const { profile, attendanceSummary } = data;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Personal Info</h3>
                    <h2 style={{ fontSize: '1.5rem' }}>{profile.name}</h2>
                    <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{profile.class?.name} - {profile.class?.section}</p>
                </div>

                <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Attendance Overview</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                        {attendanceSummary.map((item: any) => (
                            <div key={item.status}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{item._count}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Performance</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <th style={{ paddingBottom: '0.75rem' }}>Subject</th>
                                <th style={{ paddingBottom: '0.75rem' }}>Type</th>
                                <th style={{ paddingBottom: '0.75rem', textAlign: 'right' }}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profile.marks.map((mark: any) => (
                                <tr key={mark.id} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem 0' }}>{mark.subject.name}</td>
                                    <td style={{ padding: '0.75rem 0' }}>{mark.type}</td>
                                    <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 'bold' }}>{mark.score}</td>
                                </tr>
                            ))}
                            {profile.marks.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No marks recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Attendance</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {profile.attendance.map((att: any) => (
                            <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                <span>{new Date(att.date).toLocaleDateString()}</span>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    backgroundColor: att.status === 'PRESENT' ? '#dcfce7' : att.status === 'ABSENT' ? '#fee2e2' : '#fef9c3',
                                    color: att.status === 'PRESENT' ? '#166534' : att.status === 'ABSENT' ? '#991b1b' : '#854d0e'
                                }}>
                                    {att.status}
                                </span>
                            </div>
                        ))}
                        {profile.attendance.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No records yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPortal;
