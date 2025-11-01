
interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  moduleType: 'panel' | 'doctor';
}

export default function Sidebar({ activeMenu, onMenuChange, moduleType }: SidebarProps) {
  const panelMenus = [
    { id: 'dashboard', label: '대시보드', icon: 'ri-dashboard-line' },
    { id: 'query', label: '질의 캔버스', icon: 'ri-search-2-line' },
    { id: 'results', label: '결과/리포트', icon: 'ri-file-chart-line' },
    { id: 'logs', label: '로그', icon: 'ri-history-line' },
    { id: 'settings', label: '설정', icon: 'ri-settings-3-line' }
  ];

  const doctorMenus = [
    { id: 'dashboard', label: '대시보드', icon: 'ri-dashboard-line' },
    { id: 'personal', label: '개인 질의', icon: 'ri-user-heart-line' },
    { id: 'cohort', label: '코호트 분석', icon: 'ri-group-line' },
    { id: 'recommendations', label: '추천 결과', icon: 'ri-medicine-bottle-line' },
    { id: 'settings', label: '설정', icon: 'ri-settings-3-line' }
  ];

  const menus = moduleType === 'panel' ? panelMenus : doctorMenus;
  const primaryColor = moduleType === 'panel' ? '#2F6BFF' : '#00C2A8';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {menus.map((menu) => (
            <li key={menu.id}>
              <button
                onClick={() => onMenuChange(menu.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeMenu === menu.id
                    ? `bg-[${primaryColor}]/10 text-[${primaryColor}] border-r-2`
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                style={activeMenu === menu.id ? { 
                  backgroundColor: `${primaryColor}10`, 
                  color: primaryColor,
                  borderRightColor: primaryColor 
                } : {}}
              >
                <i className={`${menu.icon} text-lg`}></i>
                {menu.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
