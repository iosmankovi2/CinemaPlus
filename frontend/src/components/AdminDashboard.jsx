import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // ako želiš stilizaciju

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ako čuvaš token
    navigate('/login');
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        🎬 <span className="cinema-red">Cinem</span><span className="plus-white">Plus</span> Admin Panel
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-main">
        <h2>Welcome, Admin!</h2>
        <p>Use the panel below to manage the system.</p>

        <div className="admin-cards">
          <div className="admin-card" onClick={() => navigate('/admin/users')}>
            👤 Manage Users
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/movies')}>
            🎥 Manage Movies
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/projections')}>
            🕒 Manage Projections
          </div>
          <div className="admin-card" onClick={() => navigate('/admin/reservations')}>
            🎫 View Reservations
          </div>
        </div>
      </main>
    </div>
  );
}
