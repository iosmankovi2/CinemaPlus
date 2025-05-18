import React, { useState, useEffect } from 'react';
import './Profile.css'; // Osiguraj da imaš ažurirani CSS
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [reservations, setReservations] = useState([]);
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
    const fetchUserProfile = async () => {
      if (!userId || !token) {
        console.error('User ID or token not found.');
        navigate('/login'); // Preusmjeri na login ako nema tokena
        return;
      }

      try {
        const response = await fetch(`http://localhost:8089/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch profile:', errorText);
          // Ovdje možeš dodati logiku za prikazivanje poruke o grešci korisniku
          return;
        }

        const userData = await response.json();
        setUser(userData);
        setEditedUser(userData); // Inicijaliziraj formu za uređivanje
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchReservations = async () => {
      if (!userId || !token) return;
      try {
        const response = await fetch(`http://localhost:8089/api/ticket/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const reservationData = await response.json();
          setReservations(reservationData);
        } else {
          console.error('Failed to fetch reservations:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchUserProfile();
    fetchReservations();
  }, [userId, token, navigate]);

 const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser(user); // Vrati na originalne podatke
  };

   const handlePasswordEditClick = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordCancelClick = () => {
    setIsChangingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8089/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditedUser(updatedUser);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        alert('Failed to update profile: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8089/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        const errorText = await response.text();
        alert('Failed to update password: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password.');
    }
  };

  if (!user) {
    return <div className="loading-container">Loading profile...</div>;
  }

    return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>
      <div className="profile-details">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input type="text" id="firstName" name="firstName" value={editedUser.firstName || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" id="lastName" name="lastName" value={editedUser.lastName || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" value={editedUser.email || ''} onChange={handleChange} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="user-info">
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleEditClick} className="edit-profile-btn">Edit Profile</button>
            <button onClick={handlePasswordEditClick} className="change-password-btn">Change Password</button>
          </div>
        )}
      </div>

      {isChangingPassword && (
        <div className="password-change-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password:</label>
              <input type="password" id="oldPassword" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Change Password</button>
              <button type="button" className="cancel-btn" onClick={handlePasswordCancelClick}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="reservations-section">
        <h2>Your Reservations & Tickets</h2>
        {reservations.length > 0 ? (
          <ul className="reservations-list">
            {reservations.map(reservation => (
              <li key={reservation.id} className="reservation-item">
                <p><strong>Reservation ID:</strong> {reservation.id}</p>
                <p><strong>Movie:</strong> {reservation.projection?.movie?.title || 'N/A'}</p>
                <p><strong>Hall:</strong> {reservation.projection?.hall?.name || 'N/A'}</p>
                <p><strong>Showtime:</strong> {new Date(reservation.projection?.startTime).toLocaleString() || 'N/A'}</p>
                <p><strong>Seat:</strong> Row {reservation.seat?.rowNumber}, Seat {reservation.seat?.seatNumber}</p>
                <p><strong>Reservation Date:</strong> {new Date(reservation.reservationDate).toLocaleString()}</p>
                <p><strong>Status:</strong> {reservation.status}</p>
                {/* Dodaj ostale relevantne informacije */}
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