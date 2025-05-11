import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
const [activeUsers, setActiveUsers] = useState(0);
const [activeMovies, setActiveMovies] = useState(0);

useEffect(() => {
  fetch("/api/users/active-count")
    .then(res => res.json())
    .then(data => setActiveUsers(data))
    .catch(err => console.error("Failed to load active users:", err));

  fetch("/api/movies/active-count")
    .then(res => res.json())
    .then(data => setActiveMovies(data))
    .catch(err => console.error("Failed to load active movies:", err));
}, []);
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
      <h2 className="logo">
        <span className="cinema">Cinema<span className="Plus">Plus</span></span> Admin
     </h2>
        <ul className="nav-list">
          <li className="active"><Link to="/admin/dashboard" className="nav-link">📊 Dashboard</Link></li>
          <li><Link to="/admin/movies" className="nav-link">🎞️ Movies</Link></li>
          <li><Link to="/admin/screenings" className="nav-link">📅 Screenings</Link></li>
          <li><Link to="/admin/bookings" className="nav-link">🎟️ Bookings</Link></li>
          <li><Link to="/admin/users" className="nav-link">👥 Users</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Revenue</p>
            <h3>$45,231.89</h3>
            <small>+20.1% from last month</small>
          </div>
          <div className="stat-card">
            <p>Tickets Sold</p>
            <h3>+2,350</h3>
            <small>+10.5% from last month</small>
          </div>
          <div className="stat-card">
            <p>Active Users</p>
            <h3>{activeUsers}</h3>
          </div>
          <div className="stat-card">
            <p>Active Movies</p>
            <h3>{activeMovies}</h3>
          </div>
        </div>

        <div className="bottom-section">
          <div className="revenue-overview">
            <h4>Revenue Overview</h4>
            <div className="chart-placeholder">Revenue Chart</div>
          </div>
          <div className="recent-bookings">
            <h4>Recent Bookings</h4>
            <ul>
              <li><strong>John Doe</strong> – Dune: Part Two <span>$24</span></li>
              <li><strong>Jane Smith</strong> – The Batman <span>$36</span></li>
              <li><strong>Robert Johnson</strong> – Oppenheimer <span>$12</span></li>
              <li><strong>Emily Davis</strong> – Poor Things <span>$24</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
