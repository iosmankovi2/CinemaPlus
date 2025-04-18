import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import za navigaciju
import { loginUser } from '../api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate(); // ✅ definisano
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = e =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await loginUser(user); // ✅ dodano response

      alert('Login successful');

      // nakon uspješnog login-a
      const data = await loginUser(user); // zamijeni 'response' sa 'data'
      const token = data.token;
      const payload = JSON.parse(atob(token.split('.')[1])); // dekodiraš JWT
      const role = payload.role;

      if (role === 'ADMIN') {
        navigate('/admin/dashboard'); // redirect na admin dashboard
      } else {
        navigate('/home'); // ili neki user dashboard
      }
    } catch (err) {
      alert(err.response?.data || 'Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          🎞️ <span className="cinema-red">Cinem</span><span className="plus-white">Plus</span>
          <p className="welcome">Welcome back</p>
          <p className="subtext">Enter your credentials to access your account</p>
        </div>
        <div className="login-toggle">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
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
          <button type="submit" className="submit-btn">
            Sign in
          </button>
        </form>
        <div className="or-text">OR CONTINUE WITH</div>
        <div className="social-buttons">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
        </div>
        <p className="terms-text">
          By continuing, you agree to our <span className="highlight">Terms of Service</span> and <span className="highlight">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
