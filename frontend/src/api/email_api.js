import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; // Change for deployment
const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
localStorage.setItem("sessionId", sessionId);

export const analyzePhishing = async (payload) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem("username");
  const res = await axios.post(`${BASE_URL}/analyze/email`, payload,
    {
    headers: {
      "X-Session-ID": sessionId,
      "Authorization": `Bearer ${token}`,
      "X-Username": username
    }
    });
  if (!res.data || typeof res.data !== 'object') {
    throw new Error("Invalid response from server");
  }
  return res;
};
