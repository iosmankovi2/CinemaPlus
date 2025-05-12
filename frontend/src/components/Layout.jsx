import React, { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 Provjera da li smo na Home stranici
  const isHome = location.pathname === '/';

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

      {/* 👇 Dinamički dodaje klasu 'no-padding' ako smo na home stranici */}
      <main className={`main-content ${isHome ? 'no-padding' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
