import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.5rem 2rem',
            background: 'var(--white)',
            borderBottom: '1px solid var(--border)'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                <Briefcase size={28} />
                JobPortal
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link to="/jobs" style={{ fontWeight: '500', color: 'var(--text-light)' }}>Find Jobs</Link>
                
                {user ? (
                    <>
                        {user.role === 'employer' ? (
                            <Link to="/employer/dashboard" style={{ fontWeight: '500', color: 'var(--text-light)' }}>Dashboard</Link>
                        ) : (
                            <Link to="/candidate/dashboard" style={{ fontWeight: '500', color: 'var(--text-light)' }}>Dashboard</Link>
                        )}
                        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/auth" className="btn btn-primary">Login / Register</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
