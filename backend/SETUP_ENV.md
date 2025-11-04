# 환경 변수 설정

## .env 파일 생성

`backend` 폴더에 `.env` 파일을 생성하고 아래 내용을 복사하세요:

```env
# Flask 설정
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production

# 데이터베이스 설정 (URL 방식 - 권장)
# 친구의 IP 주소: 192.168.65.1
# JDBC 형식: jdbc:postgresql://192.168.65.1:5432/Retail
# 표준 형식: postgresql://postgres:753951@192.168.65.1:5432/Retail
DATABASE_URL=jdbc:postgresql://192.168.65.1:5432/Retail

# 데이터베이스 설정 (개별 값 - DATABASE_URL이 없을 때 사용)
DB_HOST=192.168.65.1
DB_PORT=5432
DB_NAME=Retail
DB_USER=postgres
DB_PASSWORD=753951

# CORS 설정
CORS_ORIGINS=http://localhost:5173
```

## URL 형식 설명

- **JDBC 형식**: `jdbc:postgresql://localhost:5432/Retail` (자동으로 변환됨)
- **표준 형식**: `postgresql://사용자명:비밀번호@호스트:포트/데이터베이스명`

## 빠른 설정 방법

PowerShell에서 실행:
```powershell
cd backend
Copy-Item env_template.txt .env
```

또는 직접 생성:
1. `backend` 폴더에 `.env` 파일 생성
2. 위 내용을 복사하여 붙여넣기
