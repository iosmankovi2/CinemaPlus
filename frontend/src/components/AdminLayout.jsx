import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashBoard/AdminDashboard.css';
import {AuthContext} from '../context/AuthContext'

const AdminLayout = ({ children }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <div className="sidebar-top">
                    <h3>
                        <span className="cinema">Cinema</span>
                        <span className="Plus">Plus</span> Admin
                    </h3>

                    <ul className="nav-list">
                        <li><Link to="/admin/dashboard" className="nav-link">📊 Dashboard</Link></li>
                        <li><Link to="/admin/movies" className="nav-link">🎞️ Movies</Link></li>
                        <li><Link to="/admin/screenings" className="nav-link">📅 Screenings</Link></li>
                        <li><Link to="/admin/bookings" className="nav-link">🎟️ Bookings</Link></li>
                        <li><Link to="/admin/users" className="nav-link">👥 Users</Link></li>
                    </ul>
                </div>

                <div className="sidebar-bottom">
                    <span onClick={handleLogout} className="nav-link logout-text">🚪 Logout</span>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
