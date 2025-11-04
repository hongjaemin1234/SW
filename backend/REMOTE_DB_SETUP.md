# 원격 데이터베이스 연결 설정 가이드

## 문제 상황
- 친구의 데이터베이스에 연결하려고 함
- 서로 다른 네트워크 (학교 와이파이) 사용
- `localhost`로는 연결 불가

## 해결 방법

### 1. 친구의 실제 IP 주소 확인 및 사용

**친구가 해야 할 일:**
1. 자신의 컴퓨터에서 IP 주소 확인:
   - Windows: `ipconfig` (IPv4 주소 확인)
   - 또는 공인 IP 확인: https://whatismyipaddress.com

2. PostgreSQL 설정 파일 수정:
   - `postgresql.conf`: `listen_addresses = '*'` 설정
   - `pg_hba.conf`: 연결 허용 IP 추가

**당신이 해야 할 일:**
`.env` 파일에서 `DB_HOST`를 친구의 IP 주소로 변경:

```env
# 친구의 로컬 IP (같은 와이파이 내) 또는 공인 IP
DB_HOST=192.168.1.100  # 친구의 로컬 IP 예시
# 또는
DATABASE_URL=jdbc:postgresql://192.168.1.100:5432/Retail
```

### 2. 네트워크 제한 확인

**학교 와이파이에서 차단될 수 있는 것:**
- 포트 5432 (PostgreSQL 기본 포트)
- 외부 네트워크 접근
- 특정 IP 범위 접근

**확인 방법:**
```powershell
# 포트 연결 테스트
Test-NetConnection -ComputerName [친구IP] -Port 5432
```

### 3. 해결 방법들

#### 방법 A: 같은 네트워크 사용 (가장 간단)
- 친구와 같은 와이파이에 연결
- `localhost` 또는 같은 네트워크의 로컬 IP 사용

#### 방법 B: SSH 터널링 (보안적)
친구가 SSH 서버를 열어두면:
```bash
ssh -L 5432:localhost:5432 [친구사용자명]@[친구IP]
```
그리고 로컬에서 `localhost:5432`로 연결

#### 방법 C: 클라우드 데이터베이스 사용
- AWS RDS, Google Cloud SQL, Azure Database 등
- 공인 IP로 접근 가능

#### 방법 D: VPN 사용
- 친구와 같은 VPN 서버에 연결
- 같은 네트워크처럼 접근 가능

#### 방법 E: 포트 포워딩 (친구가 설정)
- 친구의 라우터에서 포트 포워딩 설정
- 공인 IP:5432 → 친구 PC:5432

### 4. 현재 설정 확인

현재 `.env` 파일 확인:
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/Retail
```

만약 친구의 IP가 `192.168.1.100`이라면:
```env
DATABASE_URL=jdbc:postgresql://192.168.1.100:5432/Retail
```

### 5. 연결 테스트

```powershell
# 연결 테스트
python test_db_url.py
```

## 주의사항

1. **보안**: 원격 DB 접근은 반드시 비밀번호 설정 필요
2. **방화벽**: 친구의 방화벽에서 PostgreSQL 포트 허용 필요
3. **PostgreSQL 설정**: `pg_hba.conf`에서 접근 허용 IP 설정 필요
