// 1. (수정) import 경로 및 Hook 추가
import { useState } from 'react';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import Badge from '../../components/base/Badge';
// (Chip 컴포넌트가 있다면 import, 예시)
// import Chip from '../../components/base/Chip'; 
import { searchPanels } from '../../services/panelAPI'; // (수정) 경로 변경
import type { PanelSearchResult } from '../../types/panel'; // (수정) 타입 import

// 2. (삭제) 컴포넌트 내부에 있던 PanelSearchResult 인터페이스 정의 삭제

export default function QueryCanvas() {
  const [query, setQuery] = useState('');
  
  // 3. (수정) API 연동을 위한 상태 정의
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PanelSearchResult | null>(null);

  // 4. (수정) API 호출 로직으로 변경
  const handleQuerySubmit = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults(null); // 새 검색 시작 시 이전 결과 초기화

    try {
      // API 호출
      const apiResponse = await searchPanels(query);
      setResults(apiResponse); // 성공 시, 받은 데이터로 상태 업데이트
    } catch (err: any) {
      setError(err.message || '질의 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">패널 질의 캔버스</h2>
        <div className="relative">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-shadow resize-none"
            placeholder="예: 서울 거주 20대 남성 중 주 3회 이상 운동하는 사람 100명"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          {/* (추가) 로딩 스피너 (필요시) */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <span>처리 중...</span>
            </div>
          )}
        </div>
        
        {/* (추가) 에러 메시지 표시 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button onClick={handleQuerySubmit} disabled={isLoading || !query.trim()}>
            {isLoading ? '처리 중...' : '실행'}
          </Button>
        </div>
      </Card>

      {/* 5. (수정) API 응답(results)이 있을 때만 결과 섹션을 렌더링 */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 추출된 조건 */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">추출된 조건</h2>
            <div className="flex flex-wrap gap-2">
              {results.extractedChips.map((chip, index) => (
                <span key={index} className="px-3 py-1 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-full text-sm font-medium">
                  {chip}
                </span>
                // (Chip 컴포넌트 사용 시)
                // <Chip key={index} label={chip} color="blue" />
              ))}
            </div>
          </Card>

          {/* 필터 미리보기 */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">필터 미리보기</h2>
            <div className="space-y-3">
              {results.previewData.map((filter, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 min-w-[100px]">{filter.column}</span>
                  <Badge variant="neutral">{filter.operator}</Badge>
                  <span className="text-gray-600">{filter.value}</span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* 예상 결과 */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">예상 결과</h2>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2F6BFF] mb-1">{results.estimatedCount.toLocaleString()}명</div>
              <div className="text-sm text-gray-600">예상 매칭 수</div>
            </div>
            {/* ... 기타 통계 ... */}
          </Card>
        </div>
      )}
    </div>
  );
}
