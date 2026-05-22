# Fast-Forward 인프라 모니터링 대시보드 (Frontend)

EC2 기반 인프라의 시스템 지표와 각종 로그를 실시간으로 모니터링하는 웹 대시보드입니다.

## 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| Framework | React + TypeScript | 19.2.5 / 6.0.2 |
| Build Tool | Vite | 8.0.10 |
| Styling | Tailwind CSS | v4.2.4 |
| Routing | React Router | v7.14.2 |
| HTTP Client | Axios | 1.15.2 |
| Chart | Recharts | 3.8.1 |
| Icons | Lucide React | - |
| Toast | React Hot Toast | 2.6.0 |

## 주요 기능

- **통합 대시보드** — 인프라 지표 실시간 차트, Web Application 로그 미리보기, 실시간 로그 스트림 (WebSocket)
- **인프라 모니터링** — 서버별 CPU / 메모리 / 디스크 사용률 조회 및 이력 테이블
- **Web Application 로그** — Nginx access/error + FastAPI 에러 + 인증 로그 통합 뷰, 행 클릭 시 상세 모달
- **접근 보안 로그** — SSH / sudo / 세션 인증 이벤트 서버별 조회
- **Nginx 로그** — Nginx 접근 및 에러 로그 조회
- **커널 로그** — 시스템 커널 이벤트 로그 조회

## 모니터링 대상 서버

| 서버명 | 역할 |
|--------|------|
| bastion-server | Public Bastion Host |
| nginx-fe-server | Frontend (Nginx) |
| fastapi-be-server | Backend (FastAPI) |
| postgre-db-server | Database (PostgreSQL) |

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://<백엔드 IP>/api/v1
VITE_WS_URL=ws://<백엔드 IP>/ws/server-status
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

### 빌드

```bash
npm run build
```

### 빌드 결과 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── api/                # Axios API 함수 (metrics, logs, security, auth)
├── assets/             # 정적 파일 (이미지, 폰트 등)
├── auth/               # JWT 토큰 관리 및 AuthContext
├── components/
│   ├── auth/           # 로그인 / 회원가입 폼 컴포넌트
│   ├── dashboard/      # 대시보드 전용 컴포넌트 (차트, 로그 스트림 등)
│   └── ui/             # 공용 컴포넌트 (DataTable, Modal, Badge, Pagination 등)
├── constants/          # 목 데이터 및 초기값
├── hooks/              # 커스텀 훅 (usePagination 등)
├── layouts/            # AppLayout (사이드바 + 헤더)
├── pages/              # 페이지 컴포넌트
├── routes/             # ProtectedRoute
└── types/              # TypeScript 인터페이스 정의
```

## 라우팅

| 경로 | 페이지 | 접근 |
|------|--------|------|
| `/login` | 로그인 | Public |
| `/` | 통합 대시보드 | Protected |
| `/infra` | 인프라 모니터링 | Protected |
| `/access-security-logs` | 접근 보안 로그 | Protected |
| `/webapp-logs` | Web Application 로그 | Protected |
| `/nginx-logs` | Nginx 로그 | Protected |
| `/kernel-logs` | 커널 로그 | Protected |

## 인증

JWT 기반 인증을 사용합니다. 로그인 시 발급된 Access Token / Refresh Token을 `localStorage`에 저장하며 (`ff.accessToken` / `ff.refreshToken`), Axios 인터셉터가 만료된 토큰을 자동으로 갱신합니다. 인증되지 않은 요청은 `/login`으로 리다이렉트됩니다.
