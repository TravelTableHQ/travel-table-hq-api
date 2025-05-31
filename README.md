# Travel Table HQ API 서버

---

## 🧬구축 환경 (간략히)

- NestJS 기반
- 데이터베이스 연동을 위해 TypeORM을 사용
- 클린 아키텍처에 가깝게 구성되어 있어 확장성과 유지보수에 유리하도록 의도.

## 🛠 사용된 주요 라이브러리

- NestJS
    - 구조적인 서버 애플리케이션을 만들기 위한 프레임워크

- SWC(Speedy Web Compiler)
    - Speedy Web Compiler의 줄임말로, Rust 언어로 작성된 매우 빠른 **트랜스파일러(Transpiler)**
    - NestJS 프로젝트에서 SWC는 TypeScript → JavaScript 변환을 기존의 tsc(TypeScript Compiler) 대신 빠르게 처리하는 데 사용.
    - 빌드속도 및 부하 획기적으로 감소 (기존 1분 -> 10초로 당긴 경험 있음)

- TypeORM
    - DB 연동을 위한 ORM 라이브러리. 테이블과 클래스를 매핑해서 SQL 없이 DB 조작 가능

- Winston
    - 로그 관리용 라이브러리. 실 서비스에서의 디버깅과 로그 분석에 유리

- pnpm
    - 빠르고 효율적인 패키지 매니저. npm보다 의존성 관리가 가볍고 빠름

## 📁 프로젝트 구조 설명

```
travel-table-hq-api/
├── src/
│   ├── main.ts                # 앱의 진입점
│   ├── app.module.ts          # 루트 모듈
│   ├── app/                   # 핵심 비즈니스 로직
│   │   ├── lib/               # 서비스 로직이 담기는 부분
│   │   └── model/             # Entity, DTO, 인터페이스 정의
│   └── framework/             # 공통 기능 모음 (미들웨어, 예외처리 등)
│       ├── interceptors/      
│       ├── filters/           
│       ├── middlewares/       
│       ├── exceptions/        
│       └── decorators/        
├── test
|  ├── app.e2e-spec.ts
|  └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
├── package.json               # 의존성 정보
└── pnpm-lock.yaml             # 패키지 버전 잠금 파일
├── .env                       # 환경변수
├── README.md                  # 프로젝트 설명서
└── nest-cli.json              # nest 빌드 설정 관리
```

## 🧱 주요 구성 요소

- ✅ main.ts와 app.module.ts
    - main.ts: 앱의 시작점. NestJS 앱을 실행시킵니다.
    - app.module.ts: 프로젝트 전체를 아우르는 모듈. 다른 기능 모듈들을 import하여 연결합니다.

- ✅ app/
    - model/: 데이터 구조 정의. 예를 들어, 데이터베이스 테이블 구조를 나타내는 Entity, API 요청/응답 형식을 위한 DTO 등이 위치합니다.
    - lib/: 실제 기능을 수행하는 서비스 로직. 예: 사용자 등록, 여행지 추천 등의 로직이 여기에 구현됩니다.

- ✅ framework/
    - 공통 인프라 기능들이 모여 있습니다. 마치 프론트엔드의 공용 유틸/훅/컴포넌트 같은 느낌입니다.

- ✅filters/:
    - 전역 예외 처리기

- ✅interceptors/:
    - 요청/응답을 가로채어 가공

- ✅middlewares/:
    - HTTP 요청 처리 전 단계에서 수행할 로직

- ✅decorators/:
    - 커스텀 데코레이터 예: @CurrentUser()

- ✅pipelines/:
    - 유효성 검사 파이프 등

## 💡 프론트엔드 개발자가 이해하면 좋은 포인트
NestJS의 모듈 시스템은 React의 컴포넌트 구조와 유사하게 느낄 수 있어요. 하나의 기능은 모듈로 묶여 있고, 그 안에 컨트롤러(라우터), 서비스(비즈니스 로직), DTO(타입 구조)가 나뉘어 있어요.

model과 lib 디렉토리는 백엔드의 'props + handler' 역할을 한다고 생각하면 됩니다. model은 데이터를, lib는 그 데이터를 어떻게 처리할지 정의합니다.

framework는 백엔드의 전역 설정 공간으로, Next.js의 _app.tsx / middleware.ts 같은 느낌입니다.