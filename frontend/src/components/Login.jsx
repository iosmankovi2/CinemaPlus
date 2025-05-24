// Login.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    try {
      const response = await fetch('http://localhost:8089/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

     
      if (!response.ok) {
        const text = await response.text();
        setErrorMessage('Invalid username or password.'); // Postavi poruku o grešci
        return;
      }


      const data = await response.json();
      login(data.token, data.role);
      localStorage.setItem('userId', data.userId);

      console.log(data.role);
      if (data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setErrorMessage('Error: Backend not running or wrong URL.'); // Postavi poruku o grešci za grešku sa serverom
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          🎞️ <span className="cinema-red">Cinema</span>
          <span className="plus-white">Plus</span>
          <p className="welcome">Welcome back</p>
          <p className="subtext">Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <label className="input-label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="m@example.com"
            value={user.email}
            onChange={handleChange}
            className="input-full"
            required
          />
          <div className="password-wrapper">
            <label className="input-label">Password</label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>
          <input
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            className="input-full"
            required
        />
         {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-btn">
            Sign in
          </button>
          <div className="register-redirect">
          <p className="register-text">
            Don't have an account?{' '}
            <span
              className="register-link"
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
}