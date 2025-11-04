import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'

// 환경 변수
const base = process.env.BASE_PATH || '/'
const isPreview = !!process.env.IS_PREVIEW

// ✅ AWS CodeBuild 호환 + ALB 허용 버전
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview)
  },

  plugins: [
    react(),
    AutoImport({
      imports: [
        {
          react: [
            'React',
            'useState',
            'useEffect',
            'useContext',
            'useReducer',
            'useCallback',
            'useMemo',
            'useRef',
            'useImperativeHandle',
            'useLayoutEffect',
            'useDebugValue',
            'useDeferredValue',
            'useId',
            'useInsertionEffect',
            'useSyncExternalStore',
            'useTransition',
            'startTransition',
            'lazy',
            'memo',
            'forwardRef',
            'createContext',
            'createElement',
            'cloneElement',
            'isValidElement'
          ]
        },
        {
          'react-router-dom': [
            'useNavigate',
            'useLocation',
            'useParams',
            'useSearchParams',
            'Link',
            'NavLink',
            'Navigate',
            'Outlet'
          ]
        },
        {
          'react-i18next': ['useTranslation', 'Trans']
        }
      ],
      dts: true,
    }),
  ],

  base,

  build: {
    sourcemap: true,
    outDir: 'dist',        // ✅ AWS CodeBuild 인식용 디렉토리
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },

  server: {
    host: '0.0.0.0',        // ✅ 외부 접근 허용
    port: 3000,             // ✅ 현재 EC2 및 ALB 포트 일치
    allowedHosts: [
      'capstone-alb-528635803.ap-northeast-2.elb.amazonaws.com', // ✅ ALB DNS 이름
      'localhost'           // ✅ 로컬 개발 시 허용
    ],
  },
})
