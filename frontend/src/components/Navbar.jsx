import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Close menu
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Logout handler
    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/auth');
    };

    // Close menu when route changes
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <div className="navbar-inner">

                {/* BRAND */}
                <Link
                    to="/"
                    className="navbar-brand"
                    onClick={closeMenu}
                >
                    <Briefcase size={26} />
                    JobPortal
                </Link>

                {/* MOBILE TOGGLE */}
                <button
                    className="navbar-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* NAV LINKS */}
                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>

                    <Link to="/jobs" className="nav-link" onClick={closeMenu}>
                        Find Jobs
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'employer' ? (
                                <Link
                                    to="/employer/dashboard"
                                    className="nav-link"
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/candidate/dashboard"
                                    className="nav-link"
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <button
                                className="btn btn-primary"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            className="btn btn-primary"
                            onClick={closeMenu}
                        >
                            Login / Register
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;