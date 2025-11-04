import axios from 'axios';

// 1. (삭제) VITE_API_BASE_URL 관련 코드를 모두 제거합니다.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  // 2. (수정) baseURL을 '/' (루트)로 변경합니다.
  //    이렇게 하면 모든 API 요청이 현재 웹페이지가
  //    서빙되는 '같은 주소'를 기준으로 한 상대 경로로 전송됩니다.
  baseURL: '/', 
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

