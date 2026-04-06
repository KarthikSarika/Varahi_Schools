import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FeeRecord {
    id: string;
    status: string;
    date: string | null;
    feeStructure: {
        name: string;
        amount: number;
        description: string;
    };
}

const ParentFees: React.FC = () => {
    const [fees, setFees] = useState<FeeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchFees = async () => {
            try {
                // High level assumption: fetch fees for the first child from profile
                const overviewRes = await axios.get('http://localhost:5000/api/student/overview', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const studentId = overviewRes.data.profile.id;

                const res = await axios.get(`http://localhost:5000/api/student/${studentId}/fees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFees(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching fees', err);
                setLoading(false);
            }
        };
        fetchFees();
    }, [token]);

    if (loading) return <div>Loading fee status...</div>;

    const totalDue = fees.filter(f => f.status === 'PENDING').reduce((acc, f) => acc + f.feeStructure.amount, 0);

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary)', color: 'white' }}>
                <div>
                    <h3 style={{ opacity: 0.9, fontSize: '0.875rem' }}>Total Pending Balance</h3>
                    <h2 style={{ fontSize: '2rem' }}>₹{totalDue.toLocaleString()}</h2>
                </div>
                <button className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>Pay Now</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f1f5f9' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Fee Description</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Payment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fees.map(fee => (
                            <tr key={fee.id} style={{ borderTop: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{fee.feeStructure.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fee.feeStructure.description}</div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>₹{fee.feeStructure.amount.toLocaleString()}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: fee.status === 'PAID' ? '#dcfce7' : '#fee2e2',
                                        color: fee.status === 'PAID' ? '#166534' : '#991b1b'
                                    }}>
                                        {fee.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {fee.date ? new Date(fee.date).toLocaleDateString() : '-'}
                                </td>
                            </tr>
                        ))}
                        {fees.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No fee records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParentFees;
