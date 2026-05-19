
=======
# Fast-Forward 인프라 모니터링 대시보드 (Frontend)

EC2 기반 인프라의 시스템 지표와 각종 로그를 실시간으로 모니터링하는 웹 대시보드입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Chart | Recharts |
| Icons | Lucide React |

## 주요 기능

- **통합 대시보드** — 인프라 지표 실시간 차트, Web Application 로그 미리보기, 실시간 로그 스트림
- **인프라 모니터링** — 서버별 CPU / 메모리 / 디스크 사용률 조회 및 이력 테이블
- **Web Application 로그** — Nginx access/error + FastAPI 에러 + 인증 로그 통합 뷰, 행 클릭 시 상세 모달
- **접근 보안 로그** — SSH / sudo / 세션 인증 이벤트 서버별 조회

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
```

### 개발 서버 실행

```bash
npm install
npm run dev
>>>>>>> 4d70b15ca93bf6493f071398087c26d03681bf62
```

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── api/            # Axios API 함수 (metrics, logs, security, auth)
├── auth/           # JWT 토큰 관리 및 AuthContext
├── components/
│   ├── dashboard/  # 대시보드 전용 컴포넌트 (차트, 로그 스트림 등)
│   └── ui/         # 공용 컴포넌트 (DataTable, Modal, Badge, Pagination 등)
├── constants/      # 목 데이터 및 초기값
├── hooks/          # usePagination 등 커스텀 훅
├── layouts/        # AppLayout (사이드바 + 헤더)
├── pages/          # 페이지 컴포넌트
├── routes/         # ProtectedRoute
└── types/          # TypeScript 인터페이스 정의
```

## 인증

JWT 기반 인증을 사용합니다. 로그인 시 발급된 Access Token / Refresh Token을 `localStorage`에 저장하며, Axios 인터셉터가 만료된 토큰을 자동으로 갱신합니다.
