# 데이터베이스 연결 설정 가이드

## DBeaver 연결 정보 확인

1. DBeaver에서 연결된 데이터베이스 정보 확인:
   - 호스트 (Host)
   - 포트 (Port, 기본값: 5432)
   - 데이터베이스 이름 (Database)
   - 사용자 (User)
   - 비밀번호 (Password)

## 환경 변수 설정

`backend` 폴더에 `.env` 파일을 생성하고 DBeaver 연결 정보와 동일하게 설정하세요:

```env
# Flask 설정
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# 데이터베이스 설정 (DBeaver 연결 정보와 동일하게 설정)
# 방법 1: DATABASE_URL 사용
DATABASE_URL=postgresql://사용자명:비밀번호@호스트:포트/데이터베이스명

# 방법 2: 개별 설정 값 사용 (DATABASE_URL이 없으면 이 값들을 사용)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=panel_db
DB_USER=postgres
DB_PASSWORD=password

# CORS 설정
CORS_ORIGINS=http://localhost:5173
```

## 예시

DBeaver 연결 정보가 다음과 같다면:
- Host: localhost
- Port: 5432
- Database: panel_db
- User: postgres
- Password: mypassword

`.env` 파일:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=panel_db
DB_USER=postgres
DB_PASSWORD=mypassword
```

또는:
```env
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/panel_db
```

## 환경 변수 로드

`backend/main.py`에서 환경 변수를 로드하도록 설정되어 있습니다.
python-dotenv 패키지가 필요합니다 (requirements.txt에 포함됨).
