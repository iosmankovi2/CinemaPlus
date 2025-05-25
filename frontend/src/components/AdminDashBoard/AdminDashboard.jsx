import React, {useState, useEffect, useContext} from "react";
import "./AdminDashboard.css";
import {Link, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext";
import AdminLayout from "../AdminLayout";

const AdminDashboard = () => {
    const [activeUsers, setActiveUsers] = useState(0);
    const [activeMovies, setActiveMovies] = useState(0);
    const [nowShowing, setNowShowing] = useState(0);
    const [upcoming, setUpcoming] = useState(0);
    const [latestTickets, setLatestTickets] = useState([]);


    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    fetch("/api/movies/count-by-status")
    .then(res => res.json())
    .then(data => {
        setNowShowing(data.showing);
        setUpcoming(data.upcoming);
    })
    .catch(err => console.error("Failed to load movie counts:", err));

    useEffect(() => {
        fetch("/api/users/active-count")
            .then(res => res.json())
            .then(data => setActiveUsers(data))
            .catch(err => console.error("Failed to load active users:", err));

        fetch("/api/movies/active-count")
            .then(res => res.json())
            .then(data => setActiveMovies(data))
            .catch(err => console.error("Failed to load active movies:", err));

        fetch("/api/tickets/latest")
            .then(res => res.json())
            .then(data => setLatestTickets(data))
            .catch(err => console.error("Failed to load latest tickets:", err));
    }, []);
    return (
        <AdminLayout>
            <div style={{ "margin-top": "8%" }}>
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
                {latestTickets.map((ticket, index) => (
                    <li key={index}>
                        <strong>{ticket.userName}</strong> – {ticket.movieTitle} <span>{ticket.price} KM</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
