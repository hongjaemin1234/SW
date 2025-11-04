// 1. (수정) useState, useEffect import
import { useState, useEffect } from 'react';
import Card from '../../components/base/Card';
import Badge from '../../components/base/Badge';

// 2. (수정) API 함수 및 "타입"들을 services와 types에서 import
import { getDashboardData } from '../../services/panelAPI';
import type { KpiData, RecentQuery } from '../../types/panel';

// 3. (삭제) 이 파일 내부에 있던 KpiData, RecentQuery 타입 선언을 모두 삭제합니다.

export default function PanelDashboard() {
  
  // 4. (수정) 하드코딩된 데이터를 state로 관리합니다.
  const [kpiData, setKpiData] = useState<KpiData[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. (추가) 컴포넌트 마운트 시 API를 호출하는 useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // API를 통해 대시보드 데이터를 가져옵니다.
        const data = await getDashboardData(); 
        setKpiData(data.kpiData);
        setRecentQueries(data.recentQueries);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때 1회만 실행

  // 6. (추가) 로딩 및 에러 상태 처리
  if (isLoading) {
    return <div className="p-6 text-center">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // 7. (수정) return 문에서는 state(kpiData, recentQueries)를 사용
  return (
    <div className="p-6 space-y-6">
      {/* KPI 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item) => (
          <Card key={item.title}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{item.title}</span>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${item.color}1A`, color: item.color }}
              >
                <i className={item.icon}></i>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="text-sm text-gray-500 mt-1">
              <span className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                {item.change}
              </span>
              <span className="ml-1">vs 어제</span>
            </div>
          </Card>
        ))}
      </div>

      {/* 최근 질의 목록 섹션 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 질의 목록</h2>
        <div className="space-y-4">
          {recentQueries.map((query) => (
            <div key={query.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">{query.query}</p>
                  <div className="flex flex-wrap gap-2">
                    {query.chips.map((chip, chipIndex) => (
                      <span 
                        key={chipIndex}
                        className="px-2 py-1 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-full text-xs font-medium"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
                <Badge variant={query.status === 'success' ? 'success' : 'warning'}>
                  {query.status === 'success' ? '성공' : '경고'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{query.time}</span>
                  <span>실행자: {query.executor}</span>
                </div>
                <span className="font-medium text-gray-700">{query.resultCount.toLocaleString()}명 추출</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
