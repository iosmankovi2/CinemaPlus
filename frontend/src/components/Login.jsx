import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../context/AuthContext';
import api from '../axios';

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
    setErrorMessage('');
>>>>>>> Stashed changes
=======
    setErrorMessage('');
>>>>>>> Stashed changes

    try {
      const response = await api.post('/users/login', user);
      const data = response.data;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
      if (!response.ok) {
        const text = await response.text();
        alert('Login failed: ' + text);
        return;
      }

      const data = await response.json();
      login(data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.token);

      navigate('/user');
    } catch (err) {
      alert('Error: Backend not running or wrong URL.');
=======
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
=======
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
>>>>>>> Stashed changes
      login(data.token, data.role);

      if (data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else {
        setErrorMessage('Error: Backend not running or wrong URL.');
      }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <button type="submit" className="submit-btn">
            Sign in
          </button>
=======
=======
>>>>>>> Stashed changes
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="submit-btn">Sign in</button>
          <div className="register-redirect">
            <p className="register-text">
              Don't have an account?{' '}
              <span className="register-link" onClick={() => navigate('/register')}>
                Register here
              </span>
            </p>
          </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        </form>
      </div>
    </div>
  );
}
