import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [tickets, setTickets] = useState([]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password change form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Email validation state (edit profile)
  const [emailError, setEmailError] = useState('');

  // Cancel reservation modal state
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState(''); // ✅ NEW
  const [isCancelling, setIsCancelling] = useState(false);

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
  // Email validation (frontend)
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

        // init email validation
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
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Tickets fetch error:', err.message);
      }
    };

    fetchProfile();
    fetchTickets();
  }, [userId, token, navigate]);

  // Edit profile inputs
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    const next = { ...editedUser, [name]: value };
    setEditedUser(next);

    if (name === 'email') {
      setEmailError(validateEmail(value));
    }
  };

  // Change password inputs
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const next = { ...passwordData, [name]: value };
    setPasswordData(next);

    if (name === 'newPassword') {
      setPasswordError(validatePasswordStrength(value));
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

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      setEmailError(validateEmail(updated?.email || ''));
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const strengthMsg = validatePasswordStrength(passwordData.newPassword);
    if (strengthMsg) {
      setPasswordError(strengthMsg);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

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

  // ---------------------------
  // Cancel reservation popup + backend call
  // ---------------------------
  const openCancelPopup = (ticket) => {
    setCancelError('');
    setCancelSuccess('');

    // safety: requires reservationId from backend
    if (!ticket?.reservationId) {
      setCancelError('Reservation id is missing. Please refresh and try again.');
      return;
    }

    setTicketToCancel(ticket);
    setShowCancelPopup(true);
  };

  const closeCancelPopup = () => {
    if (isCancelling) return; // avoid closing mid-request
    setShowCancelPopup(false);
    setTicketToCancel(null);
    setCancelError('');
  };

  const confirmCancelReservation = async () => {
    if (!ticketToCancel?.reservationId) {
      setCancelError('Reservation id is missing.');
      return;
    }

    setIsCancelling(true);
    setCancelError('');
    setCancelSuccess('');

    try {
      const res = await fetch(
        `http://localhost:8089/api/tickets/reservation/${ticketToCancel.reservationId}/cancel`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setTickets((prev) =>
        prev.map((t) =>
          t.reservationId === ticketToCancel.reservationId
            ? { ...t, status: 'CANCELLED' }
            : t
        )
      );

      setCancelSuccess('Reservation cancelled successfully.');
      setShowCancelPopup(false);
      setTicketToCancel(null);
    } catch (err) {
      setCancelError(err.message || 'Cancel failed.');
    } finally {
      setIsCancelling(false);
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

                {field === 'email' && emailError && (
                  <p className="error-text" style={{ marginTop: 6 }}>
                    {emailError}
                  </p>
                )}
              </div>
            ))}

            <div className="form-actions">
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

        {/* ✅ Success message after cancellation */}
        {cancelSuccess && (
          <p className="success-text" style={{ marginBottom: 10 }}>
            {cancelSuccess}
          </p>
        )}

        {tickets.length > 0 ? (
          <ul className="reservations-list">
            {tickets.map((ticket) => {
              const isCancelled = (ticket.status || '').toUpperCase() === 'CANCELLED';

              return (
                <li key={ticket.id} className="reservation-item">
                  <p>
                    <strong>Ticket ID:</strong> {ticket.id}
                  </p>

                  <p>
                    <strong>Reservation ID:</strong> {ticket.reservationId || 'N/A'}
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
                    <strong>Seat:</strong> {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : String(ticket.seats)}
                  </p>
                  <p>
                    <strong>Price:</strong> {ticket.price ? `${ticket.price} BAM` : 'N/A'}
                  </p>

                  <p>
                    <strong>Status:</strong> {ticket.status || 'N/A'}
                  </p>

                  {!isCancelled ? (
                    <button
                      className="cancel-reservation-btn"
                      onClick={() => openCancelPopup(ticket)}
                      disabled={!ticket.reservationId}
                      title={!ticket.reservationId ? 'Reservation ID missing' : 'Cancel reservation'}
                    >
                      Cancel reservation
                    </button>
                  ) : (
                    <button className="cancel-reservation-btn" disabled title="Already cancelled">
                      Cancelled
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>

      {showCancelPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancel reservation</h3>

            <p>
              Are you sure you want to cancel this reservation?
              <br />
              <strong>Reservation ID:</strong> {ticketToCancel?.reservationId}
              <br />
              <strong>Ticket ID:</strong> {ticketToCancel?.id}
            </p>

            {cancelError && (
              <p className="error-text" style={{ marginTop: 8 }}>
                {cancelError}
              </p>
            )}

            <div className="modal-actions">
              <button className="save-btn" onClick={confirmCancelReservation} disabled={isCancelling}>
                {isCancelling ? 'Cancelling...' : 'Yes, cancel'}
              </button>
              <button className="cancel-btn" onClick={closeCancelPopup} disabled={isCancelling}>
                No, keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
