import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode, role: string }> = ({ children, role }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = {
        ADMIN: [
            { name: 'Dashboard', path: '/admin' },
            { name: 'Teachers', path: '/admin/teachers' },
            { name: 'Students', path: '/admin/students' },
            { name: 'Classes', path: '/admin/classes' },
            { name: 'Announcements', path: '/announcements' },
        ],
        TEACHER: [
            { name: 'Dashboard', path: '/teacher' },
            { name: 'Attendance', path: '/teacher/attendance' },
            { name: 'Marks', path: '/teacher/marks' },
            { name: 'Announcements', path: '/announcements' },
        ],
        STUDENT: [
            { name: 'Dashboard', path: '/student' },
            { name: 'Marks', path: '/student/marks' },
            { name: 'Announcements', path: '/announcements' },
        ],
        PARENT: [
            { name: 'Dashboard', path: '/parent' },
            { name: 'Fee Status', path: '/parent/fees' },
            { name: 'Announcements', path: '/announcements' },
        ],
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'var(--surface)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <h2 style={{ color: 'var(--primary-light)', fontSize: '1.25rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Varahi Schools</h2>
                </div>
                <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                    {(navItems[role as keyof typeof navItems] || []).map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                                backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                marginBottom: '0.5rem',
                                fontWeight: isActive ? '600' : '400',
                            })}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{user.profile?.name || 'User'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{role}</div>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', border: '1px solid var(--error)', color: 'var(--error)' }}>Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem', backgroundColor: 'var(--background)', overflowY: 'auto' }}>
                <header style={{ 
                    marginBottom: '2.5rem', 
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '-0.025em', background: 'linear-gradient(to right, var(--primary-light), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Varahi Schools
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>
                        {role.charAt(0) + role.slice(1).toLowerCase()} Portal
                    </p>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
