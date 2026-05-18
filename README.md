# FAST-FORWARD-FE

React + TypeScript + Vite 기반의 프론트엔드 프로젝트입니다.

---

## 📋 목차

- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [환경변수 설정](#환경변수-설정)
- [폴더 구조](#폴더-구조)
- [스크립트](#스크립트)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios |
| Chart | Recharts |
| Icon | Lucide React |

---

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치(how to run)

```bash
# 저장소 클론
git clone https://github.com/your-org/fast-forward-fe.git
cd fast-forward-fe

# 패키지 설치
npm install
```

### 환경변수 설정

아래 [환경변수 설정](#환경변수-설정) 섹션을 참고하여 `.env.development` 또는 `.env.prod` 파일을 설정합니다.

### 개발 서버 실행

```bash
npm run dev

브라우저에서 `http://localhost:5173` 으로 접속합니다.

### 프로덕션 빌드

```bash
npm run build


빌드 결과물은 `dist/` 폴더에 생성됩니다.

### 빌드 결과 미리보기

```bash
npm run preview
---

## 환경변수 설정

프로젝트 루트에 환경별 파일을 생성합니다.

| 파일 | 용도 |
|------|------|
| `.env.development` | 로컬 개발 환경 |
| `.env.prod` | 프로덕션 환경 |

```env
# 예시 (.env.development)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Fast Forward
```

> **Note**: `VITE_` 접두사가 붙은 변수만 클라이언트 코드에서 사용할 수 있습니다.  
> 절대로 `.env` 파일을 git에 커밋하지 마세요. (`.gitignore`에 포함되어 있습니다)

---

## 폴더 구조

```
FAST-FORWARD-FE/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD 워크플로우
├── public/                 # 정적 파일 (favicon 등)
├── src/                    # 소스 코드
│   ├── api/                # API 호출 모듈 (axios 기반)
│   ├── assets/             # 이미지, 폰트 등 정적 자원
│   ├── auth/               # 인증 관련 로직 (토큰, 가드 등)
│   ├── components/         # 공통 재사용 컴포넌트
│   ├── constants/          # 상수 정의
│   ├── layouts/            # 레이아웃 컴포넌트 (Header, Sidebar 등)
│   ├── pages/              # 페이지 단위 컴포넌트
│   ├── routes/             # 라우팅 설정
│   ├── types/              # TypeScript 타입 정의
│   ├── App.css             # 글로벌 스타일
│   ├── App.tsx             # 루트 컴포넌트
│   ├── index.css           # 기본 CSS (Tailwind 진입점)
│   └── main.tsx            # 애플리케이션 진입점
├── .env.development        # 개발 환경변수
├── .env.prod               # 프로덕션 환경변수
├── .gitignore
├── index.html              # HTML 템플릿
├── package.json
├── tailwind.config.js      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 설정
├── vite.config.ts          # Vite 설정
└── README.md
```

---

## 스크립트

```bash
npm run dev       # 개발 서버 실행 (HMR 지원)
npm run build     # 프로덕션 빌드 (TypeScript 컴파일 + Vite 번들링)
npm run preview   # 빌드 결과 로컬 미리보기
npm run lint      # ESLint 코드 검사
```
