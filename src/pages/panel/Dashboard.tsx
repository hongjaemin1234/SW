// 1. useState와 useEffect를 import 합니다.
import { useState, useEffect } from 'react';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';
// 2. 대시보드 데이터를 가져올 API 함수를 import 합니다. (api/panelAPI.ts에 추가 필요)
import { getDashboardData } from '../../api/panelAPI'; 

// 3. API로 받아올 데이터 타입을 정의합니다. (kpiData, recentQueries)
interface KpiData {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RecentQuery {
  id: number;
  query: string;
  chips: string[];
  status: 'success' | 'warning';
  time: string;
  executor: string;
  resultCount: number;
}

interface DashboardData {
  kpiData: KpiData[];
  recentQueries: RecentQuery[];
}

export default function PanelDashboard() {
  // 4. 하드코딩된 데이터를 state로 관리합니다. 초기값은 null 또는 빈 배열.
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. 컴포넌트 마운트 시 API를 호출하는 useEffect를 추가합니다.
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 백엔드에서 대시보드 데이터를 한 번에 가져옵니다.
        const data: DashboardData = await getDashboardData(); 
        setKpiData(data.kpiData);
        setRecentQueries(data.recentQueries);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 1회만 실행

  // 6. 로딩 및 에러 상태를 UI에 표시합니다.
  if (isLoading) {
    return <div className="p-6">로딩 중...</div>; // 👈 로딩 스피너 컴포넌트 사용
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>; // 👈 에러 메시지 표시
  }

  // 7. return 문에서는 하드코딩된 변수 대신 state(kpiData, recentQueries)를 사용합니다.
  return (
    <div className="p-6 space-y-6">
      {/* KPI 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* state에 저장된 kpiData를 map으로 렌더링 */}
        {kpiData.map((item) => (
          <Card key={item.title}>
             {/* ... (기존 렌더링 코드와 동일) ... */}
             <div className="text-2xl font-bold text-gray-900">{item.value}</div>
          </Card>
        ))}
      </div>

      {/* 최근 질의 목록 섹션 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 질의 목록</h2>
        <div className="space-y-4">
          {/* state에 저장된 recentQueries를 map으로 렌더링 */}
          {recentQueries.map((query) => (
            <div key={query.id} className="border border-gray-100 rounded-lg p-4 ...">
              {/* ... (기존 렌더링 코드와 동일) ... */}
              <p className="text-gray-900 font-medium mb-2">{query.query}</p>
              {/* ... */}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}