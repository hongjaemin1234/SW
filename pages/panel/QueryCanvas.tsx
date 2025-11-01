// 1. 필요한 Hook과 API 함수, 타입을 import 합니다.
import { useState } from 'react';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import Chip from '../../components/base/Chip';
import Badge from '../../components/base/Badge';
import { searchPanels } from '../../api/panelAPI'; // (이 파일은 별도 생성 필요)

// API 응답 데이터의 타입을 정의합니다. (백엔드와 협의 필요)
interface PanelSearchResult {
  extractedChips: string[];
  previewData: {
    column: string;
    operator: string;
    value: string;
  }[];
  estimatedCount: number;
  // ... 기타 필요한 데이터
}

export default function QueryCanvas() {
  const [query, setQuery] = useState('');
  
  // 2. UI 상태 관리를 위한 state들을 재정의/추가합니다.
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PanelSearchResult | null>(null);

  // 3. handleQuerySubmit 함수를 실제 API를 호출하는 비동기 함수로 변경합니다.
  const handleQuerySubmit = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResults(null); // 새 검색 시작 시 이전 결과 초기화

    try {
      // API 호출 (예시: /api/panel/search)
      const apiResponse = await searchPanels(query);
      setResults(apiResponse); // 성공 시, 받은 데이터로 results 상태 업데이트
    } catch (err) {
      // 실패 시, 에러 상태 업데이트
      setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err); // 개발자를 위해 콘솔에 에러 로그 출력
    } finally {
      // 성공/실패 여부와 관계없이 로딩 상태 종료
      setIsLoading(false);
    }
  };

  const removeChip = (index: number) => {
    if (!results) return;
    // results 상태 내부의 extractedChips를 업데이트합니다.
    const newChips = results.extractedChips.filter((_, i) => i !== index);
    setResults({ ...results, extractedChips: newChips });
  };

  return (
    <div className="p-6 space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">질의 캔버스</h1>
          <p className="text-gray-600 mt-1">자연어로 패널 추출 조건을 입력하세요</p>
        </div>
      </div>

      {/* 자연어 입력 */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">자연어 질의 입력</h2>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 서울 거주 20대 남성 중 주 3회 이상 운동하는 사람 100명 추출해줘"
            className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#2F6BFF] focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleQuerySubmit();
              }
            }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <i className="ri-mic-line text-lg"></i>
            </button>
            {/* 4. Button의 상태를 isProcessing 대신 isLoading과 연동합니다. */}
            <Button onClick={handleQuerySubmit} disabled={!query.trim() || isLoading}>
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  처리 중...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line mr-2"></i>
                  실행
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Enter로 실행, Shift+Enter로 줄바꿈
        </div>
      </Card>
      
      {/* 5. API 호출 실패 시 에러 메시지를 표시하는 UI를 추가합니다. */}
      {error && (
          <Card className="bg-red-50 border-red-200">
              <p className="text-red-700">
                <i className="ri-error-warning-line mr-2"></i>
                {error}
              </p>
          </Card>
      )}

      {/* 6. API 호출 성공 시에만 결과 영역을 보여주도록 조건을 변경합니다. */}
      {results && !isLoading && (
        <>
          {/* 파싱 결과 칩 */}
          {results.extractedChips.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">추출된 조건</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {results.extractedChips.map((chip, index) => (
                  <Chip 
                    key={index} 
                    variant="primary"
                    onRemove={() => removeChip(index)}
                    onClick={() => {/* 칩 편집 로직 */}}
                  >
                    {chip}
                  </Chip>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <i className="ri-information-line mr-1"></i>
                칩을 클릭하여 수정하거나 X를 눌러 제거할 수 있습니다
              </p>
            </Card>
          )}

          {/* 필터 미리보기 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">필터 미리보기</h2>
              <div className="space-y-3">
                {/* 7. 하드코딩된 previewData 대신 API 응답(results.previewData)으로 렌더링합니다. */}
                {results.previewData.map((filter, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700 min-w-[100px]">{filter.column}</span>
                    <Badge variant="neutral">{filter.operator}</Badge>
                    <span className="text-gray-600">{filter.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  {/* ... */}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">예상 결과</h2>
              <div className="space-y-4">
                <div className="text-center">
                  {/* 8. 예상 결과도 API 응답으로 렌더링합니다. */}
                  <div className="text-3xl font-bold text-[#2F6BFF] mb-1">{results.estimatedCount}명</div>
                  <div className="text-sm text-gray-600">예상 매칭 수</div>
                </div>
                {/* ... 기타 통계 데이터 렌더링 ... */}
              </div>
              <div className="flex gap-3 mt-6">
                  {/* ... 버튼들 ... */}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}