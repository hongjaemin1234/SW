import axios from 'axios';

// Vite가 제공하는 환경 변수 객체를 사용합니다.
const baseURL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;