import { useState } from 'react';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import Badge from '../../components/base/Badge';
import Chip from '../../components/base/Chip'; // Chip 컴포넌트 import (사용자 파일 목록에 있음)
import { searchPanels } from '../../services/panelAPI';
import type { PanelSearchResult } from '../../types/panel'; // 'most up-to-date file'의 수정된 타입을 import

export default function QueryCanvas() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PanelSearchResult | null>(null);

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

  /**
   * (추가) 패널 ID 목록을 CSV로 다운로드하는 함수
   * '일치율' 점수 산출을 위해 테스터가 ID를 비교할 수 있도록 합니다.
   */
  const handleDownloadIds = () => {
    if (!results || !results.panelIds.length) return;
    
    // 패널 ID 목록을 CSV 문자열로 생성 (헤더 + 각 ID)
    const header = "panel_id (mb_sn)\n";
    const csvContent = "data:text/csv;charset=utf-8," + header + results.panelIds.join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "panel_ids_export.csv");
    document.body.appendChild(link); // Required for FF
    
    link.click(); // 다운로드 실행
    document.body.removeChild(link); // 링크 제거
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">패널 질의 캔버스</h2>
        <div className="relative">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent transition-shadow resize-none"
            placeholder="예: 서울 20대 남자 100명"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
              <i className="ri-loader-4-line animate-spin text-2xl text-[#2F6BFF]"></i>
              <span className="ml-2 font-medium text-gray-700">처리 중...</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button onClick={handleQuerySubmit} disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                처리 중...
              </>
            ) : '실행'}
          </Button>
        </div>
      </Card>

      {/* 5. (수정) API 응답(results)이 있을 때만 결과 섹션을 렌더링 */}
      {results && (
        <>
          {/* (추가) "정확도 증거 3": 경고 및 참고 사항 렌더링 */}
          {results.warnings && results.warnings.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-yellow-800 mb-4">참고 사항 (LLM 해석)</h2>
              <div className="space-y-2">
                {results.warnings.map((warning, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
                    <i className="ri-information-line mr-2"></i>
                    {warning}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* "정확도 증거 1": 추출된 조건 */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">추출된 조건 (Chips)</h2>
              <div className="flex flex-wrap gap-2">
                {results.extractedChips.map((chip, index) => (
                  <Chip key={index} variant="primary">
                    {chip}
                  </Chip>
                ))}
              </div>
            </Card>

            {/* "정확도 증거 2": 필터 미리보기 (수정됨) */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">필터 미리보기 (정확도 증거)</h2>
              <div className="space-y-3">
                {results.previewData.map((filter, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      {/* 사용자용 컬럼명 (Human-readable) */}
                      <span className="font-medium text-gray-800">{filter.columnHuman}</span>
                      {/* 테스터용 원본 컬럼명 (Raw) */}
                      <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-md">{filter.columnRaw}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="neutral">{filter.operator}</Badge>
                      <span className="text-gray-700 font-medium">{filter.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* "일치율 결과 1 & 2": 예상 결과 및 ID 다운로드 (수정됨) */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">추출 결과 (일치율)</h2>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-600">총 패널 수</div>
                  <div className="text-4xl font-bold text-[#2F6BFF] mt-1">
                    {results.estimatedCount.toLocaleString()}명
                  </div>
                </div>
                <div className="border-l border-blue-200 h-16 mx-4"></div>
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-600">ID 일치 수 (테스터용)</div>
                  <div className="text-4xl font-bold text-[#2F6BFF] mt-1">
                    {results.panelIds.length.toLocaleString()}개
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleDownloadIds} 
                  disabled={!results.panelIds || results.panelIds.length === 0}
                  variant="secondary"
                >
                  <i className="ri-download-2-line mr-2"></i>
                  패널 ID 목록 다운로드 (CSV)
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

