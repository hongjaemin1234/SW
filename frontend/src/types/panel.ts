/**
 * 자연어 질의 API 응답 (QueryCanvas.tsx용)
 */
export interface PanelSearchResult {
  extractedChips: string[];
  previewData: {
    column: string;
    operator: string;
    value: string;
  }[];
  estimatedCount: number;
}

/**
 * 대시보드 KPI 항목 타입 (Dashboard.tsx용)
 */
export interface KpiData {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

/**
 * 대시보드 최근 질의 항목 타입 (Dashboard.tsx용)
 */
export interface RecentQuery {
  id: number;
  query: string;
  chips: string[];
  status: 'success' | 'warning';
  time: string;
  executor: string;
  resultCount: number;
}

/**
 * 대시보드 전체 데이터 API 응답 (Dashboard.tsx용)
 */
export interface DashboardData {
  kpiData: KpiData[];
  recentQueries: RecentQuery[];
}
