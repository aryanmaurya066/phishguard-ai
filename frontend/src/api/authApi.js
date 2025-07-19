import axios from 'axios';

const BASE_URL = "http://localhost:8000";

export const registerUser = async (userData) => {
  return axios.post(`${BASE_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${BASE_URL}/login`, userData);
};
