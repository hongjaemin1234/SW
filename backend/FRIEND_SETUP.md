# 친구가 해야 할 PostgreSQL 설정 (외부 접근 허용)

## ✅ 체크리스트

친구가 다음 작업을 완료해야 합니다:

- [ ] 1. PostgreSQL 서버가 실행 중인지 확인
- [ ] 2. `postgresql.conf`에서 외부 접근 허용 설정
- [ ] 3. `pg_hba.conf`에서 접근 허용 IP 추가
- [ ] 4. PostgreSQL 서버 재시작
- [ ] 5. 방화벽에서 포트 5432 허용
- [ ] 6. IP 주소 확인 (실제 IP가 192.168.65.1인지)

---

## 📋 상세 설정 방법

### 1단계: PostgreSQL 서버 실행 확인

**Windows 서비스 확인:**
1. `Win + R` → `services.msc` 입력
2. "postgresql" 검색
3. 상태가 "실행 중"인지 확인
4. 실행 중이 아니면 "시작" 클릭

또는 PowerShell에서:
```powershell
Get-Service -Name postgresql*
```

### 2단계: postgresql.conf 파일 수정

**파일 위치 찾기:**
- 보통: `C:\Program Files\PostgreSQL\[버전]\data\postgresql.conf`
- 또는: `C:\Users\[사용자명]\AppData\Local\PostgreSQL\data\postgresql.conf`

**수정 방법:**
1. 파일을 메모장으로 열기 (관리자 권한 필요할 수 있음)
2. `Ctrl + F`로 `listen_addresses` 검색
3. 다음 줄 찾기:
   ```
   #listen_addresses = 'localhost'
   ```
   또는
   ```
   listen_addresses = 'localhost'
   ```

4. 다음으로 변경:
   ```
   listen_addresses = '*'
   ```
   (주석 `#` 제거하고 `*`로 변경)

5. 파일 저장

### 3단계: pg_hba.conf 파일 수정

**파일 위치:**
- `postgresql.conf`와 같은 폴더에 `pg_hba.conf` 있음

**수정 방법:**
1. 파일 끝에 다음 줄 추가:
   ```
   # 외부 접근 허용 (모든 IP)
   host    all    all    0.0.0.0/0    md5
   ```

2. 파일 저장

**보안을 위해 특정 IP만 허용하려면:**
```
# 학교 와이파이 IP만 허용 (예시)
host    all    all    192.168.65.0/24    md5
```

### 4단계: PostgreSQL 서버 재시작

**방법 1: 서비스 관리자 사용**
1. `Win + R` → `services.msc`
2. PostgreSQL 서비스 찾기
3. 우클릭 → "다시 시작"

**방법 2: PowerShell (관리자 권한)**
```powershell
Restart-Service postgresql*
```

### 5단계: Windows 방화벽 설정

**방법 1: PowerShell (관리자 권한)**
```powershell
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow
```

**방법 2: GUI 사용**
1. Windows 검색 → "방화벽" → "Windows Defender 방화벽" 열기
2. "고급 설정" 클릭
3. "인바운드 규칙" → "새 규칙"
4. "포트" 선택 → 다음
5. "TCP" 선택, "특정 로컬 포트": `5432` 입력 → 다음
6. "연결 허용" 선택 → 다음
7. 모든 프로필 체크 → 다음
8. 이름: "PostgreSQL" 입력 → 완료

### 6단계: IP 주소 확인

**PowerShell에서:**
```powershell
ipconfig
```

**IPv4 주소 확인:**
- 예: `192.168.65.1` (이미 알고 있는 IP)
- 다른 IP가 나오면 알려주기

### 7단계: 연결 테스트 (친구 PC에서)

친구가 자신의 PC에서 다음 명령으로 확인:
```powershell
# PostgreSQL 명령줄 도구 사용
psql -U postgres -d Retail -h localhost -p 5432
```

---

## 🔍 문제 해결

### PostgreSQL 서비스가 시작되지 않는 경우

1. **오류 로그 확인:**
   - `C:\Program Files\PostgreSQL\[버전]\data\log\` 폴더 확인
   - 최신 로그 파일 열어서 오류 확인

2. **포트 충돌 확인:**
   ```powershell
   netstat -ano | findstr :5432
   ```
   다른 프로그램이 포트를 사용 중일 수 있음

### 파일을 저장할 수 없는 경우

- 관리자 권한으로 메모장 실행
- 또는 파일 속성에서 "읽기 전용" 해제

### 방화벽 설정 후에도 연결 안 되는 경우

1. **라우터 설정 확인:**
   - 같은 네트워크 내인지 확인
   - 라우터의 방화벽 설정 확인

2. **다른 방화벽 프로그램 확인:**
   - 백신 프로그램의 방화벽
   - 다른 보안 프로그램

---

## ✅ 설정 완료 확인

친구가 설정을 완료한 후, 당신의 PC에서 테스트:

```powershell
python test_network.py 192.168.65.1 5432
```

성공하면:
```
✅ 포트 5432 연결 성공!
```

그 다음:
```powershell
python test_connection.py 192.168.65.1
```

---

## 📝 참고사항

- **보안**: `0.0.0.0/0`은 모든 IP에서 접근을 허용합니다. 프로덕션 환경에서는 특정 IP만 허용하는 것이 좋습니다.
- **같은 네트워크**: `192.168.65.1`은 같은 와이파이 내부 IP입니다. 다른 네트워크에서는 접근이 안 될 수 있습니다.
- **공인 IP**: 인터넷을 통해 접근하려면 공인 IP와 포트 포워딩이 필요합니다.
