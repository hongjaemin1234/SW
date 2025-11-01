import apiClient from './client';

// 타입을 QueryCanvas.tsx 와 동일하게 맞춥니다.
interface PanelSearchResult {
  extractedChips: string[]; // 👈 'chips' -> 'extractedChips'로 변경
  previewData: {         // 👈 'any[]' -> 구체적인 타입으로 변경
    column: string;
    operator: string;
    value: string;
  }[];
  estimatedCount: number;
}

/**
 * 자연어 질의로 패널을 검색하는 API
 * @param queryText 사용자가 입력한 자연어
 * @returns 검색 결과
 */
export const searchPanels = async (queryText: string): Promise<PanelSearchResult> => {
  try {
    const response = await apiClient.post('/panel/search', { query: queryText });
    
    // 백엔드 응답(response.data)이 위 PanelSearchResult 타입과
    // 정확히 일치하는지 확인해야 합니다.
    return response.data; 
  } catch (error) {
    console.error("패널 검색 API 오류:", error);
    throw error;
  }
};

// ... (기존 searchPanels 함수 코드 아래에 추가) ...

// 대시보드 데이터 타입을 정의합니다. (Dashboard.tsx와 동일하게)
interface KpiData { /* ... */ }
interface RecentQuery { /* ... */ }
interface DashboardData {
  kpiData: KpiData[];
  recentQueries: RecentQuery[];
}

/**
 * 패널 대시보드 데이터(KPI, 최근 질의)를 가져오는 API
 * @returns 대시보드 데이터
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // 1. 실제로는 백엔드 API를 호출합니다. (예: GET /api/panel/dashboard)
    // const response = await apiClient.get('/panel/dashboard');
    // return response.data;

    // 2. (지금 당장) 백엔드가 없으므로, 1초 뒤에 가짜(Mock) 데이터를 반환합니다.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: DashboardData = {
      kpiData: [
        { title: '총 패널 수', value: '35,000명', change: '+2.5%', icon: 'ri-group-line', color: '#2F6BFF' },
        { title: '오늘 처리 건수', value: '127건', change: '+15.3%', icon: 'ri-file-search-line', color: '#00C2A8' },
        // ... (원래 Dashboard.tsx에 있던 하드코딩 데이터) ...
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
        // ... (원래 Dashboard.tsx에 있던 하드코딩 데이터) ...
      ]
    };
    return mockData;

  } catch (error) {
    console.error("대시보드 API 오류:", error);
    throw error;
  }
};