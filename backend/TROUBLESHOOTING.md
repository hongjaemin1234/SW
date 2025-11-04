# 데이터베이스 연결 문제 해결 가이드

## 현재 상황
- 친구의 IP: `192.168.65.1`
- 학교 와이파이 사용
- 연결 타임아웃 발생

## 단계별 문제 해결

### 1단계: 네트워크 연결 확인

```powershell
python test_network.py 192.168.65.1 5432
```

이 명령으로:
- 호스트 접근 가능 여부 확인 (Ping)
- 포트 5432 연결 가능 여부 확인

### 2단계: 문제 진단

#### A. 타임아웃 오류가 발생하는 경우

**원인:**
1. 다른 네트워크에 있음 (학교 와이파이 vs 친구 와이파이)
2. PostgreSQL 서버가 외부 접근을 허용하지 않음
3. 방화벽에서 포트 차단
4. PostgreSQL 서버가 실행 중이지 않음

**해결 방법:**

**친구가 해야 할 일:**

1. **PostgreSQL 설정 파일 수정**
   - `postgresql.conf` 파일 찾기 (보통 `C:\Program Files\PostgreSQL\...\data\postgresql.conf`)
   - `listen_addresses = 'localhost'` → `listen_addresses = '*'` 로 변경
   - PostgreSQL 재시작 필요

2. **접근 허용 설정**
   - `pg_hba.conf` 파일 찾기 (같은 폴더)
   - 파일 끝에 추가:
   ```
   host    all    all    0.0.0.0/0    md5
   ```
   - PostgreSQL 재시작

3. **방화벽 설정**
   - Windows 방화벽에서 포트 5432 인바운드 규칙 추가
   - 또는 방화벽 임시로 비활성화해서 테스트

4. **IP 주소 확인**
   - `ipconfig`로 실제 IP 확인
   - `192.168.65.1`이 맞는지 확인

#### B. 인코딩 오류가 발생하는 경우

이미 Python 코드에서 `set_client_encoding('UTF8')`을 사용하도록 수정했지만, 
연결 풀 생성 시점에 발생할 수 있습니다.

**해결 방법:**
- 연결 풀 생성 후 각 연결에서 인코딩 설정
- 이미 구현되어 있음

### 3단계: 대안 방법

#### 방법 1: 같은 와이파이 사용 (가장 간단)
- 친구와 같은 와이파이에 연결
- `localhost` 또는 같은 네트워크의 로컬 IP 사용

#### 방법 2: VPN 사용
- 같은 VPN 서버에 연결
- 같은 네트워크처럼 접근 가능

#### 방법 3: SSH 터널링
친구가 SSH 서버를 열어두면:
```bash
ssh -L 5432:localhost:5432 [친구사용자명]@192.168.65.1
```
그리고 로컬에서 `localhost:5432`로 연결

#### 방법 4: 클라우드 DB 사용
- AWS RDS, Google Cloud SQL 등
- 공인 IP로 접근 가능

### 4단계: 연결 테스트

네트워크 확인 후:
```powershell
python test_connection.py 192.168.65.1
```

## 빠른 체크리스트

친구에게 확인 요청:
- [ ] PostgreSQL 서버 실행 중?
- [ ] `postgresql.conf`에서 `listen_addresses = '*'` 설정?
- [ ] `pg_hba.conf`에서 접근 허용 IP 추가?
- [ ] 방화벽에서 포트 5432 허용?
- [ ] IP 주소가 `192.168.65.1`이 맞는지?

당신이 확인:
- [ ] `python test_network.py 192.168.65.1 5432` 실행
- [ ] `.env` 파일에 올바른 IP 설정?
- [ ] 같은 네트워크에 있는지?
