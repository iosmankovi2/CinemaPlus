import axios from 'axios';

const API_BASE = 'http://localhost:8089/api/users';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE}/login`, userData);
  return response.data;
};