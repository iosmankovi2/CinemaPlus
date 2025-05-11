import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import {AuthContext} from "../context/AuthContext";

export default function Login() {
    const [user, setUser] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) =>
        setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8089/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const text = await response.text();
                alert('Login failed: ' + text);
                return;
            }

            const token = await response.text();
            login(token); // <== this updates context & localStorage
            navigate('/user');
        } catch (err) {
            alert('Error: Backend not running or wrong URL.');
            console.error(err);
        }
    };



  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          🎞️ <span className="cinema-red">Cinem</span>
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
          <button type="submit" className="submit-btn">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}