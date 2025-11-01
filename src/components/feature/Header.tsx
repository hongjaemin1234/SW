
import { useState } from 'react';
import Button from '../base/Button';

interface HeaderProps {
  activeTab: 'panel' | 'doctor';
  onTabChange: (tab: 'panel' | 'doctor') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 로고 및 서비스명 */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2F6BFF] rounded-lg flex items-center justify-center">
            <i className="ri-dashboard-3-line text-white text-lg"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Pacifico", serif' }}>
            Panel Doctor Dashboard
          </h1>
        </div>

        {/* 탭 전환 */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onTabChange('panel')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'panel' 
                ? 'bg-white text-[#2F6BFF] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            기업용 패널 추출
          </button>
          <button
            onClick={() => onTabChange('doctor')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'doctor' 
                ? 'bg-white text-[#00C2A8] shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            AI 닥터 추천
          </button>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
            <i className="ri-search-line text-lg"></i>
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 relative">
            <i className="ri-notification-3-line text-lg"></i>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF5A5A] rounded-full"></span>
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <i className={`${isDarkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg`}></i>
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="w-8 h-8 bg-[#00C2A8] rounded-full flex items-center justify-center text-white font-medium"
            >
              U
            </button>
            {showProfile && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <i className="ri-user-line mr-2"></i>프로필 설정
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <i className="ri-settings-3-line mr-2"></i>환경 설정
                </button>
                <hr className="my-2" />
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <i className="ri-logout-box-line mr-2"></i>로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
