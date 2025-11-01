// (파일 위치: src/api/panelAPI.ts)

import apiClient from './client';

// ----------------------------------------------------------------
// (추가/수정) 타입 정의를 한 곳에서 관리하고 "export" 합니다.
// ----------------------------------------------------------------

/** QueryCanvas.tsx에서 사용하는 타입 */
export interface PanelSearchResult {
  extractedChips: string[];
  previewData: {
    column: string;
    operator: string;
    value: string;
  }[];
  estimatedCount: number;
}

/** Dashboard.tsx에서 사용하는 KPI 타입 */
export interface KpiData {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

/** Dashboard.tsx에서 사용하는 최근 질의 타입 */
export interface RecentQuery {
  id: number;
  query: string;
  chips: string[];
  status: 'success' | 'warning';
  time: string;
  executor: string;
  resultCount: number;
}

/** Dashboard.tsx에서 사용하는 전체 데이터 타입 */
export interface DashboardData {
  kpiData: KpiData[];
  recentQueries: RecentQuery[];
}


// ----------------------------------------------------------------
// API 함수들
// ----------------------------------------------------------------

/**
 * 자연어 질의로 패널을 검색하는 API (QueryCanvas.tsx용)
 * @param queryText 사용자가 입력한 자연어
 * @returns 검색 결과
 */
export const searchPanels = async (queryText: string): Promise<PanelSearchResult> => {
  try {
    // 실제 백엔드 API 호출
    const response = await apiClient.post('/panel/search', { query: queryText });
    return response.data;
    
    // (백엔드 미구현 시 목업 테스트)
    /*
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockResponse: PanelSearchResult = {
      extractedChips: ['서울', '20대', '남성'],
      previewData: [
        { column: 'address', operator: 'LIKE', value: '서울%' },
        { column: 'age', operator: 'BETWEEN', value: '20-29' },
      ],
      estimatedCount: 142,
    };
    return mockResponse;
    */

  } catch (error) {
    console.error("패널 검색 API 오류:", error);
    throw error;
  }
};


/**
 * 패널 대시보드 데이터(KPI, 최근 질의)를 가져오는 API (Dashboard.tsx용)
 * @returns 대시보드 데이터
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // (중요) 실제로는 백엔드 API를 호출합니다.
    // const response = await apiClient.get('/panel/dashboard');
    // return response.data;

    // (지금 당장) 백엔드가 없으므로, 1초 뒤에 가짜(Mock) 데이터를 반환합니다.
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
        {
          id: 2,
          query: '부산 30대 여성 중 직장인이면서 자녀가 있는 사람',
          chips: ['부산', '30대', '여성', '직장인', '자녀 있음'],
          status: 'warning',
          time: '15분 전',
          executor: '박분석',
          resultCount: 0
        },
      ]
    };
    return mockData;

  } catch (error) {
    console.error("대시보드 API 오류:", error);
    throw error;
  }
};