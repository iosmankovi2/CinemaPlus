import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [tickets, setTickets] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !token) return navigate('/login');

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8089/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setUser(data);
        setEditedUser(data);
      } catch (err) {
        console.error('Profile fetch error:', err.message);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await fetch(`http://localhost:8089/api/tickets/user/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error('Tickets fetch error:', err.message);
      }
    };

    fetchProfile();
    fetchTickets();
  }, [userId, token, navigate]);

  const handleUserChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8089/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedUser)
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setUser(updated);
      setEditedUser(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword)
      return alert("Passwords do not match!");

    try {
      const res = await fetch(`http://localhost:8089/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (!res.ok) throw new Error(await res.text());
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      alert('Password change failed: ' + err.message);
    }
  };

  if (!user) return <div className="loading-container">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header"><h1>Your Profile</h1></div>

      <div className="profile-details">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            {['firstName', 'lastName', 'email'].map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{field.replace(/^\w/, c => c.toUpperCase())}:</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={editedUser[field] || ''}
                  onChange={handleUserChange}
                  required
                />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="user-info">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => setIsEditing(true)} className="edit-profile-btn">Edit Profile</button>
            <button onClick={() => setIsChangingPassword(true)} className="change-password-btn">Change Password</button>
          </div>
        )}
      </div>

      {isChangingPassword && (
        <div className="password-change-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            {['oldPassword', 'newPassword', 'confirmNewPassword'].map(name => (
              <div className="form-group" key={name}>
                <label htmlFor={name}>{name.replace(/([A-Z])/g, ' $1')}:</label>
                <input
                  type="password"
                  id={name}
                  name={name}
                  value={passwordData[name]}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="save-btn">Change Password</button>
              <button type="button" className="cancel-btn" onClick={() => setIsChangingPassword(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="reservations-section">
        <h2>Your Tickets</h2>
        {tickets.length > 0 ? (
          <ul className="reservations-list">
            {tickets.map(ticket => (
              <li key={ticket.id} className="reservation-item">
                <p><strong>Ticket ID:</strong> {ticket.id}</p>
                <p><strong>Movie:</strong> {ticket.movieTitle || 'N/A'}</p>
                <p><strong>Hall:</strong> {ticket.hallName || 'N/A'}</p>
                <p><strong>Date:</strong> {ticket.date|| 'N/A'}</p>
                <p><strong>Showtime:</strong> {ticket.time}</p>
                <p><strong>Seat:</strong> {ticket.seats}</p>
                <p><strong>Price:</strong> {ticket.price + ' BAM' || 'N/A'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
