# 🥔 감자놀이터

> 실시간 표정 인식 AI와 상황 기반 퀘스트를 결합해, 만 3~7세 아동이 놀이로 감정을 배우는 인터랙션 기반 정서 학습 플랫폼

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonaws&logoColor=white)

## 🏆 수상

- 2026 캡스톤디자인 경진대회 **우수상 (사업단장상)**
- 한국정보기술학회 **우수논문상 (동상)** - 「MER 기반 실시간 표정 인식을 활용한 아동 사회성 향상 시스템」

## 📖 프로젝트 소개

감자놀이터는 전면 카메라로 아동의 표정을 실시간 분석하고, 일상 시나리오에 맞는 표정을 짓도록 유도하는 **인터랙션 기반 아동 정서 학습 플랫폼**입니다. 학습 데이터를 바탕으로 보호자에게 감정 리포트도 제공합니다.

### 기획 배경

- **정서 발달의 결정적 시기**: 만 3~7세는 감정 인식, 정서 조절, 초기 사회성 발달의 골든 타임입니다.
- **대면 상호작용 공백**: 코로나19 장기화로 아동의 사회적 경험이 줄면서 타인의 표정을 읽고 맥락을 이해하는 능력이 저하되었습니다.
- **ASD 아동의 교육 수요**: 자폐 스펙트럼 장애(ASD) 아동은 표정 인식에 더 큰 어려움을 겪지만, 일상에서 접근 가능한 전문 교육 솔루션은 부족합니다.
- **기존 방식의 한계**: 감정 카드, 그림책, 보드게임은 정적이고 실시간 피드백이 없으며, 기존 앱은 터치 중심의 카드 매칭에 머물러 있습니다.

### 타깃 유저

| 구분 | 대상 |
|---|---|
| 주 타깃 | 만 3~7세 유아 및 아동 |
| 부 타깃 | 집중적인 감정 학습이 필요한 ASD 아동 |
| 간접 타깃 | 학부모, 특수교사, 아동 심리 상담 전문가 |

## ✨ 주요 기능

| 기능 | 설명 |
|---|---|
| 감정 미러링 | 카메라 기반으로 표정을 프레임 단위 분석하고, 현재 감정을 거울처럼 즉시 시각·음성 피드백으로 반환합니다. |
| 표정 따라하기 (Expression) | TTS 미션을 제시하면 아동이 표정으로 응답하고, AI가 정답 여부를 실시간 판정합니다. 터치 없이 표정만으로 진행됩니다. |
| 상황별 표정 짓기 (Inference) | LLM이 일상 상황을 제시하면 감정을 유추해 표정으로 표현합니다. (상황 인지 → 감정 유추 → 표정 표현의 3단계 구조) |
| 캐릭터 도감 | 경험치와 레벨에 따라 생성형 AI로 제작한 캐릭터 카드가 해금됩니다. |
| 감정 리포트 | 감정별 정답률과 표현 비율을 시각화해 보호자가 아동의 정서 상태를 객관적으로 확인할 수 있습니다. |

## 🛠️ 기술 스택

| 분류 | 기술 |
|---|---|
| Client | React |
| Core Service | Spring Boot |
| AI Sub-Backend | Flask |
| Database | PostgreSQL |
| AI | Swin Transformer + ConvNeXt Ensemble |
| CI/CD & Infra | GitHub, Docker, Docker Compose, AWS EC2 |

## 🏗️ 시스템 구조

```
[React 클라이언트]
      │  웹캠 영상 / REST API
      ▼
[Spring Boot (Core Service)] ───► [PostgreSQL (AWS RDS)]
      │
      ▼
[Flask (AI 서버)]
      └─ Swin Transformer + ConvNeXt 앙상블 표정 인식
      └─ LLM 상황 퀴즈 생성
```

### 유저 플로우

```
로그인/회원가입 → 메인 대시보드
  ├─ 캐릭터 도감 (레벨별 해금 캐릭터 확인)
  └─ 게임 시작
       → 게임 세션 생성
       → 라운드 진입 (문제 출제)
       → 웹캠 활성화
       → 실시간 표정 분석 (Flask AI 서버)
       → 표정 이벤트 기록
       → 라운드 종료 및 채점 (다음 라운드 반복)
       → 게임 세션 종료 (경험치 정산, 캐릭터 해금 체크)
       → 결과 리포트 화면
```

## 🗄️ 데이터베이스 설계

| 테이블 | 설명 |
|---|---|
| `users` | 사용자 계정 정보 |
| `user_progress` | 누적 경험치 및 레벨 |
| `game_sessions` | 게임 시작~종료 단위의 세션 |
| `game_rounds` | 문제별 채점 결과 |
| `emotion_events` | 표정 인식 로그 (감정 키워드, 신뢰도) |
| `character_cards` | 도감 캐릭터 정보 |
| `user_characters` | 유저가 해금한 캐릭터 |

## 🧠 AI 모델

### 데이터셋

- 아동 미세 표정 데이터셋 **CMED**(Child Micro-Expression Dataset)의 영상을 1fps로 프레임 추출하고, OpenCV(Haar Cascade)로 얼굴 영역을 검출해 224×224 이미지로 구성했습니다.
- 피험자 단위로 학습(70%) / 검증(15%) / 테스트(15%)를 분할해 Data Leakage를 방지했습니다.
- 7개 감정(무표정, 행복, 화남, 슬픔, 공포, 놀람, 역겨움)을 **4개 클래스(긍정 / 부정 / 중립 / 놀람)**로 재구성했습니다.

### 클래스 불균형 해결

- 데이터 증강, 소수 클래스(부정·놀람) 오버샘플링, 다수 클래스(긍정·중립) 언더샘플링
- Gemini API 기반 합성 이미지 추가
- WeightedRandomSampler 및 클래스 가중치 손실 함수 적용

### 모델 구조

- **Swin Transformer**: 윈도우 기반 어텐션으로 국소적인 얼굴 근육 변화를 포착합니다.
- **ConvNeXt-Base**: 텍스처, 색상 등 전역 특징 추출에 강점이 있습니다.
- 두 모델의 예측 확률을 **Weighted Soft Voting**으로 결합해 단일 모델 대비 성능을 높였습니다.

### 성능

| 클래스 | F1-Score |
|---|---|
| 긍정 | 79.2% |
| 중립 | 92.2% |
| 부정 | 2.3% → 최대 19.7% (합성 이미지 및 샘플링 조정 후) |
| 놀람 | 2.0% |

부정·놀람 클래스는 원본 데이터가 절대적으로 부족해 성능이 낮았고, 이는 향후 개선 과제입니다.

## 🌿 브랜치 구조

| 브랜치 | 설명 |
|---|---|
| `main` | 프로젝트 개요 (README) |
| `feature/frontend-ui` | 프론트엔드 전체 코드 (React) |
| `feature/backend-ai-api-integration` | AI 서버(Flask)와 백엔드 서버(Spring Boot) 통합 코드 |

> 소스코드는 위 feature 브랜치에서 확인할 수 있습니다.

## ⚠️ 한계 및 향후 과제

- **'정답 중심' 설계의 한계**: 보상을 얻으려고 시스템이 원하는 정답 표정을 짓게 되면 아동의 정서적 자율성이 침해될 수 있습니다.
- **개선 방향**: 복수의 감정을 허용하는 다중 선택 시나리오 구조와, 아동이 표현한 감정 자체를 인정하고 격려하는 자율적 놀이 모드를 도입할 계획입니다.
- 부정·놀람 클래스의 데이터 보강과 성능 개선이 필요합니다.

## 👥 팀원

| 이름 | 역할 |
|---|---|
| 이윤지 (팀장) | PM / AI 모델링 |
| 변예은 | UI/UX 디자인 / 프론트엔드 |
| 손세연 | 인터랙션 기획 / 프론트엔드 |
| 이여진 | 데이터베이스 설계, 도감 및 유저 기능 개발, 시스템 통합 / 백엔드 |
| 한윤슬 | 게임 기능 개발, AI 서버 연동, 시스템 통합 / 백엔드 |

## 🔗 링크

- 🎬 [데모 영상](https://www.youtube.com/watch?v=4ecRnOw7wrA) (링크 한정 공개)
