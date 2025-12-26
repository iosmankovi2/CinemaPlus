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
  const [passwordError, setPasswordError] = useState('');

  // ✅ NEW: email validation state
  const [emailError, setEmailError] = useState('');

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // ---------------------------
  // Password validation (frontend = backend rules)
  // min 8 + 1 uppercase + 1 lowercase + 1 number + 1 special char
  // ---------------------------
  const passwordStrengthRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  const validatePasswordStrength = (pwd) => {
    if (!pwd || pwd.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pwd)) return 'Password must include at least 1 uppercase letter.';
    if (!/[a-z]/.test(pwd)) return 'Password must include at least 1 lowercase letter.';
    if (!/\d/.test(pwd)) return 'Password must include at least 1 number.';
    if (!/[^A-Za-z0-9]/.test(pwd)) return 'Password must include at least 1 special character.';
    if (!passwordStrengthRegex.test(pwd)) return 'Password does not meet the required strength.';
    return '';
  };

  // ---------------------------
  // ✅ Email validation (frontend)
  // - no spaces
  // - must look like name@domain.com
  // ---------------------------
  const emailRegex = /^(?!.*\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const validateEmail = (email) => {
    if (!email) return 'Email is mandatory.';
    if (!emailRegex.test(email)) return 'Email should be a valid format (e.g. name@domain.com).';
    return '';
  };

  useEffect(() => {
    if (!userId || !token) return navigate('/login');

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8089/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setUser(data);
        setEditedUser(data);

        // initialize email validation state (optional)
        setEmailError(validateEmail(data?.email || ''));
      } catch (err) {
        console.error('Profile fetch error:', err.message);
      }
    };

    const fetchTickets = async () => {
      try {
        const res = await fetch(`http://localhost:8089/api/tickets/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  // ✅ updated to validate email while typing
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    const next = { ...editedUser, [name]: value };
    setEditedUser(next);

    if (name === 'email') {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const next = { ...passwordData, [name]: value };
    setPasswordData(next);

    // live validation UX
    if (name === 'newPassword') {
      const strengthMsg = validatePasswordStrength(value);
      setPasswordError(strengthMsg);
    }

    if (name === 'confirmNewPassword') {
      if (next.newPassword && value && next.newPassword !== value) {
        setPasswordError('Passwords do not match.');
      } else {
        setPasswordError(validatePasswordStrength(next.newPassword));
      }
    }

    if (name === 'oldPassword') {
      if (next.newPassword && next.confirmNewPassword && next.newPassword !== next.confirmNewPassword) {
        setPasswordError('Passwords do not match.');
      } else {
        setPasswordError(validatePasswordStrength(next.newPassword));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ block submit if email invalid
    const emailMsg = validateEmail(editedUser.email || '');
    if (emailMsg) {
      setEmailError(emailMsg);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8089/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setUser(updated);
      setEditedUser(updated);
      setIsEditing(false);

      // keep validation state in sync
      setEmailError(validateEmail(updated?.email || ''));
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const strengthMsg = validatePasswordStrength(passwordData.newPassword);
    if (strengthMsg) return alert(strengthMsg);

    if (passwordData.newPassword !== passwordData.confirmNewPassword)
      return alert('Passwords do not match!');

    try {
      const res = await fetch(`http://localhost:8089/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setPasswordError('');
      alert('Password updated successfully!');
    } catch (err) {
      alert('Password change failed: ' + err.message);
    }
  };

  if (!user) return <div className="loading-container">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>

      <div className="profile-details">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            {['firstName', 'lastName', 'email'].map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{field.replace(/^\w/, (c) => c.toUpperCase())}:</label>

                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={editedUser[field] || ''}
                  onChange={handleUserChange}
                  required
                  {...(field === 'email'
                    ? {
                        pattern: '^(?!.*\\s)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$',
                        title: 'Email must be like name@domain.com (no spaces)',
                      }
                    : {})}
                />

                {/* ✅ Show email validation message under email field */}
                {field === 'email' && emailError && (
                  <p className="error-text" style={{ marginTop: 6 }}>
                    {emailError}
                  </p>
                )}
              </div>
            ))}

            <div className="form-actions">
              {/* ✅ disable save when email invalid */}
              <button type="submit" className="save-btn" disabled={!!emailError}>
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                  setEmailError(validateEmail(user?.email || ''));
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="user-info">
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <button
              onClick={() => {
                setIsEditing(true);
                setEmailError(validateEmail(editedUser?.email || user?.email || ''));
              }}
              className="edit-profile-btn"
            >
              Edit Profile
            </button>

            <button
              onClick={() => {
                setIsChangingPassword(true);
                setPasswordError(validatePasswordStrength(passwordData.newPassword));
              }}
              className="change-password-btn"
            >
              Change Password
            </button>
          </div>
        )}
      </div>

      {isChangingPassword && (
        <div className="password-change-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            {['oldPassword', 'newPassword', 'confirmNewPassword'].map((name) => (
              <div className="form-group" key={name}>
                <label htmlFor={name}>
                  {name.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}:
                </label>

                <input
                  type="password"
                  id={name}
                  name={name}
                  value={passwordData[name]}
                  onChange={handlePasswordChange}
                  required
                  {...(name === 'newPassword'
                    ? {
                        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$',
                        title:
                          'At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character',
                      }
                    : {})}
                />
              </div>
            ))}

            {passwordError && (
              <p className="error-text" style={{ marginTop: 8 }}>
                {passwordError}
              </p>
            )}

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={!!passwordError}>
                Change Password
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
                  setPasswordError('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reservations-section">
        <h2>Your Tickets</h2>
        {tickets.length > 0 ? (
          <ul className="reservations-list">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="reservation-item">
                <p>
                  <strong>Ticket ID:</strong> {ticket.id}
                </p>
                <p>
                  <strong>Movie:</strong> {ticket.movieTitle || 'N/A'}
                </p>
                <p>
                  <strong>Hall:</strong> {ticket.hallName || 'N/A'}
                </p>
                <p>
                  <strong>Date:</strong> {ticket.date || 'N/A'}
                </p>
                <p>
                  <strong>Showtime:</strong> {ticket.time}
                </p>
                <p>
                  <strong>Seat:</strong> {ticket.seats}
                </p>
                <p>
                  <strong>Price:</strong> {ticket.price + ' BAM' || 'N/A'}
                </p>
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
