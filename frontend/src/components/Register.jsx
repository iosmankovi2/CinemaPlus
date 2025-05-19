import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [modalVisible, setModalVisible] = useState(false); // State za vidljivost modala
  const [modalMessage, setModalMessage] = useState(''); // State za poruku u modalu
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      setModalMessage('Passwords do not match');
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:8089/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
        }),
      });

      if (response.ok) {
        setModalMessage('Registration successful!');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigate('/login');
        }, 3000);
      } else {
        const errorText = await response.text();
        setModalMessage('Registration failed: ' + errorText);
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
      }
    } catch (error) {
      setModalMessage('An error occurred: ' + error.message);
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          🎞️ <span className="cinema-red">Cinema</span><span className="plus-white">Plus</span>
          <p className="welcome">Create your account</p>
          <p className="subtext">Enter your information to get started</p>
        </div>
        <div className="register-toggle">
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="name-fields">
            <input
              name="firstName"
              placeholder="First name"
              value={user.firstName}
              onChange={handleChange}
              className="input-half"
              required
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={user.lastName}
              onChange={handleChange}
              className="input-half"
              required
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="input-full"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="input-full"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
            className="input-full"
            required
          />
          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>
      </div>
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}