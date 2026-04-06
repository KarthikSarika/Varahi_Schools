import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--background)',
            color: 'var(--text-main)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background elements for rich aesthetics */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(15,23,42,0) 70%)',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw',
                background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, rgba(15,23,42,0) 70%)',
                zIndex: 0
            }}></div>

            {/* Header / Navbar */}
            <header style={{
                padding: '1.5rem 3rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        V
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>
                        Varahi Schools
                    </h1>
                </div>

                <nav>
                    <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                        Login
                    </button>
                </nav>
            </header>

            {/* Main Content (Hero) */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', zIndex: 10, textAlign: 'center' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '800px' }}>
                    Empowering the Next Generation of <span style={{ background: 'linear-gradient(to right, var(--primary-light), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Leaders</span>
                </h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
                    Varahi Schools provides a world-class educational experience focusing on holistic development, innovation, and character building in a supportive environment.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className="card" style={{ padding: '2rem', minWidth: '280px', textAlign: 'left', borderTop: '4px solid var(--primary)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🎓</span> Admissions
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Enrollment for the current academic year is now open. Join our community today!
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>📞 7396351571</li>
                            <li style={{ marginBottom: '0.5rem' }}>✉️ admissions@varahischools.edu</li>
                            <li>📍 beside "sarika's home , koppka"</li>
                        </ul>
                    </div>

                    <div className="card" style={{ padding: '2rem', minWidth: '280px', textAlign: 'left', borderTop: '4px solid var(--secondary)' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>🏫</span> Campus Life
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            Explore our state-of-the-art facilities, clubs, and extracurricular activities.
                        </p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Learn more about our campus →</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.875rem', zIndex: 10 }}>
                &copy; {new Date().getFullYear()} Varahi Schools. All rights reserved.
            </footer>
        </div>
    );
};

export default Landing;
