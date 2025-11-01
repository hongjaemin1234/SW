import axios from 'axios';

// .env 파일 (VITE_API_BASE_URL=http://localhost:5000) 에서 환경변수를 읽어옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 필요시 타임아웃, 인증 토큰 등 추가
});

// 요청/응답 인터셉터 (로깅, 에러 공통 처리 등)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리 로직
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
