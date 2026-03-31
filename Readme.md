## `.env` 파일 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 작성하세요.

```env
POSTGRES_DB=emotion_db
POSTGRES_USER=emotion_user
POSTGRES_PASSWORD=emotion123

SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/emotion_db
SPRING_DATASOURCE_USERNAME=emotion_user
SPRING_DATASOURCE_PASSWORD=emotion123
```
주의 사항
- 공백 없이 `KEY=VALUE` 형태로 작성
- 따옴표(`"`) 사용 금지
- `.env` 파일은 `docker-compose.yml`과 같은 위치에 있어야 합니다
### 보안 주의사항
- `.env` 파일은 Git에 포함하지 않도록 `.gitignore`에 추가하세요
---
## Docker 실행
### 컨테이너 빌드 및 실행
```bash
docker-compose up --build
```
### 백그라운드 실행
```bash
docker-compose up -d --build
```
### 컨테이너 종료
```bash
docker-compose down
```
### 볼륨까지 삭제 (DB 초기화)
```bash
docker-compose down -v
```
---
## 서비스 접속 정보
### Spring Boot API
```
http://localhost:8082
```
### PostgreSQL DB
| 항목       | 값            |
| -------- | ------------ |
| Host     | localhost    |
| Port     | 5433         |
| Database | emotion_db   |
| Username | emotion_user |
| Password | emotion123   |
---
## API 테스트
### 회원가입
- POST `/api/users/register`
```JSON
{
    "userId": "test123",
    "password": "1234",
    "confirmPassword": "1234",
    "username": "홍길동"
}
```
### 로그인
- POST `api/users/login`
```JSON
{
    "userId": "test123",
    "password": "1234"
}
```
