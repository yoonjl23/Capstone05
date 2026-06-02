# 감자놀이터 — 프론트엔드 실행 가이드

> 서버(AI + 백엔드 + DB)는 `203.249.22.51`에서 상시 운영 중
> 다른 PC에서는 **프론트엔드만 실행**

---

## 사전 준비

Node.js 18 이상이 필요

```bash
node --version   # v18 이상이면 OK
npm --version
```

없으면 설치:

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# macOS (Homebrew)
brew install node

# Windows
# https://nodejs.org 에서 LTS 버전 설치
```

---

## 실행 방법 (3단계)

### 1. 레포 클론

```bash
git clone https://github.com/yoonjl23/Capstone05.git
cd Capstone05
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속하면 됩니다.

---

## 서버 구성

프론트엔드의 `/api` 요청은 vite proxy를 통해 자동으로 서버로 전달됩니다.

| 구성 요소 | 주소 | 설명 |
|-----------|------|------|
| AI 서버 (Flask) | `203.249.22.51:5000` | 감정 인식 추론 API |
| 백엔드 (Spring Boot) | `203.249.22.51:8080` | 메인 백엔드 API |
| PostgreSQL | 내부 | 데이터베이스 (외부 접근 불필요) |
| 프론트엔드 | `localhost:5173` | 로컬에서 실행 |

---

## 서버 상태 확인

```bash
# 백엔드 health 체크
curl http://203.249.22.51:8080/actuator/health
# {"status":"UP"} 이면 정상

# AI 서버 health 체크
curl http://203.249.22.51:5000/health
```

---

## 트러블슈팅

### API 요청이 안 될 때

서버 연결 확인:

```bash
curl http://203.249.22.51:8080/actuator/health
curl http://203.249.22.51:5000/health
```

### 포트 충돌 시

```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

### node_modules 오류 시

```bash
rm -rf node_modules package-lock.json
npm install
```
