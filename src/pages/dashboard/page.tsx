
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/feature/Header';
import Sidebar from '../../components/feature/Sidebar';
import PanelDashboard from '../panel/Dashboard';
import QueryCanvas from '../panel/QueryCanvas';
import DoctorDashboard from '../doctor/Dashboard';
import PersonalQuery from '../doctor/PersonalQuery';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'panel' | 'doctor'>('panel');
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // URL 파라미터에서 탭 상태 읽기
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'doctor' || tab === 'panel') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderContent = () => {
    if (activeTab === 'panel') {
      switch (activeMenu) {
        case 'dashboard':
          return <PanelDashboard />;
        case 'query':
          return <QueryCanvas />;
        case 'results':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">결과/리포트</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-file-chart-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">추출된 결과와 리포트가 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        case 'logs':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">로그</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-history-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">질의 실행 로그가 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        case 'settings':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">설정</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-settings-3-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">패널 추출 관련 설정이 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        default:
          return <PanelDashboard />;
      }
    } else {
      switch (activeMenu) {
        case 'dashboard':
          return <DoctorDashboard />;
        case 'personal':
          return <PersonalQuery />;
        case 'cohort':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">코호트 분석</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-group-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">코호트 분석 결과가 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        case 'recommendations':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">추천 결과</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-medicine-bottle-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">추천 결과 히스토리가 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        case 'settings':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">설정</h1>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <i className="ri-settings-3-line text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-600">AI 닥터 관련 설정이 여기에 표시됩니다.</p>
              </div>
            </div>
          );
        default:
          return <DoctorDashboard />;
      }
    }
  };

  const handleTabChange = (tab: 'panel' | 'doctor') => {
    setActiveTab(tab);
    setActiveMenu('dashboard'); // 탭 변경 시 대시보드로 리셋
    
    // URL 파라미터 업데이트
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar 
          activeMenu={activeMenu} 
          onMenuChange={setActiveMenu} 
          moduleType={activeTab}
        />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
