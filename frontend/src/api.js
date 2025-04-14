import axios from 'axios';

const API_BASE = 'http://localhost:8089/api/users';

export const registerUser = user =>
  axios.post(`${API_BASE}/register`, user);

export const loginUser = user =>
  axios.post(`${API_BASE}/login`, user);

