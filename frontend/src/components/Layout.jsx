import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import './Layout.css';

const Layout = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <header className="navbar">
                <Link to="/" className="logo">
                    🎞️ <span><span className="cinema-red">Cinema</span><span className="plus-white">Plus</span></span>
                </Link>
                <nav className="nav-links">
                    <Link to="/sale" className="nav-link">Halls</Link>
                    <Link to="/movies" className="nav-link">Movies</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/user" className="nav-link">Profile</Link>
                            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
