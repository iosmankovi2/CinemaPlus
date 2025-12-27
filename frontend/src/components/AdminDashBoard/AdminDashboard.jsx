import React, { useState, useEffect, useContext } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../AdminLayout";

const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [activeMovies, setActiveMovies] = useState(0);
  const [nowShowing, setNowShowing] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [latestTickets, setLatestTickets] = useState([]);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const authFetchJson = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }

    // ako je response prazan ili nije json, vrati null
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return null;

    return res.json();
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await authFetchJson("/api/users/active-count");
        setActiveUsers(typeof data === "number" ? data : 0);
      } catch (err) {
        console.error("Failed to load active users:", err.message);
      }
    })();

    (async () => {
      try {
        const data = await authFetchJson("/api/movies/active-count");
        setActiveMovies(typeof data === "number" ? data : 0);
      } catch (err) {
        console.error("Failed to load active movies:", err.message);
      }
    })();

    (async () => {
      try {
        const data = await authFetchJson("/api/tickets/latest");
        setLatestTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load latest tickets:", err.message);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <div style={{ marginTop: "8%" }}>
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

          <div className="recent-bookings">
            <h4>Recent Bookings</h4>
            <ul>
              {latestTickets.map((ticket, index) => (
                <li key={index}>
                  <strong>{ticket.userName}</strong> – {ticket.movieTitle}{" "}
                  <span>{ticket.price} KM</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
