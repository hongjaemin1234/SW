import apiClient from './http';

// (수정) 중복으로 import된 DashboardData를 제거했습니다.
import type { 
  PanelSearchResult, 
  DashboardData 
} from '../types/panel';

// ----------------------------------------------------------------
// API 함수들
// ----------------------------------------------------------------

/**
 * 자연어 질의로 패널을 검색하는 API (QueryCanvas.tsx용)
 * 백엔드 API (예: POST /api/panel/search)를 호출합니다.
 * @param queryText 사용자가 입력한 자연어
 * @returns 검색 결과
 */
export const searchPanels = async (queryText: string): Promise<PanelSearchResult> => {
  try {
    // 백엔드 Flask API의 /api/panel/search 엔드포인트 (예시)
    const response = await apiClient.post('/api/panel/search', { query: queryText });
    
    // 백엔드가 kure-v1, psql을 통해 처리한 결과를 반환
    return response.data;
  } catch (error) {
    console.error("패널 검색 API 오류:", error);
    throw error;
  }
};

/**
 * 패널 대시보드 데이터(KPI, 최근 질의)를 가져오는 API (Dashboard.tsx용)
 * 백엔드 API (예: GET /api/panel/dashboard)를 호출합니다.
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // (수정) Mock 데이터를 제거하고 실제 API 호출을 활성화합니다.
    // 백엔드 Flask API의 /api/panel/dashboard 엔드포인트 (예시)
    const response = await apiClient.get('/api/panel/dashboard');
    return response.data;

    /* (주석 처리) Mock 데이터 로직
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: DashboardData = {
      kpiData: [
        { title: '총 패널 수', value: '35,000명', change: '+2.5%', icon: 'ri-group-line', color: '#2F6BFF' },
        { title: '오늘 처리 건수', value: '127건', change: '+15.3%', icon: 'ri-file-search-line', color: '#00C2A8' },
        { title: '평균 응답 시간', value: '1.2초', change: '-8.1%', icon: 'ri-timer-line', color: '#FFC757' },
        { title: '질의 성공률', value: '94.2%', change: '+1.8%', icon: 'ri-check-double-line', color: '#18C08F' }
      ],
      recentQueries: [
        {
          id: 1,
          query: '서울 거주 20대 남성 중 운동을 주 3회 이상 하는 사람 100명',
          chips: ['서울', '20대', '남성', '운동 3회+', '100명'],
          status: 'success',
          time: '2분 전',
          executor: '김데이터',
          resultCount: 98
        },
        // ... (다른 최근 질의) ...
      ]
    };
    return mockData;
    */

  } catch (error) {
    console.error("대시보드 API 오류:", error);
    throw error;
  }
};

