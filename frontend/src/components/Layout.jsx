import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/" className="logo">
          🎞️ <span><span className="cinema-red">Cinema</span><span className="plus-white">Plus</span></span>
        </Link>
        <nav className="nav-links">
          <Link to="/sale" className="nav-link">Sale</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;