import os
import json
import random
from google import genai
from google.genai import types

class QuizManager:
    def __init__(self):

        # 1. 클라이언트 초기화
        api_key = os.environ.get("GEMINI_API_KEY", "")
        if not api_key:
            print("⚠️ 경고: GEMINI_API_KEY가 설정되지 않았습니다!")

        self.model_name = "gemini-2.5-flash"
        self.client = genai.Client(api_key=api_key)

        self.ALLOWED_EMOTIONS = ["positive", "negative", "neutral", "surprise"]
        self.DEMO_QUESTIONS = [
            {
                "text": "생일날 친구들이 깜짝 파티를 준비해 줬어요!",
                "target": "positive",
                "type": "표정 놀이"
            },
            {
                "text": "길을 걷다가 갑자기 커다란 개미가 튀어나왔어요!",
                "target": "surprise",
                "type": "표정 놀이"
            }
        ]

    def generate_question(self) -> dict:
        """새로운 SDK 방식을 사용하여 퀴즈 문제를 생성합니다."""
        prompt = (
            "유아용 감정 표현 게임을 위한 문제를 1개 만들어 JSON으로 출력하세요.\n"
            "상황 설명(text) 작성 지침:\n"
            "- 반드시 한 문장으로만 작성하세요. (예: '생일날 친구들이 깜짝 파티를 준비해 줬어요!')\n"
            "- 문장은 '~요!' 또는 '~어요!' 로 끝내세요.\n"
            "- 아이들이 일상(유치원, 집, 꿈속, 동화 등)에서 겪을 법한 구체적인 장면을 담으세요.\n"
            "- 이전과 겹치지 않는 새로운 소재를 사용하세요.\n"
            "- 말투는 아주 다정하고 친절한 한국어로 작성하세요.\n\n"
            f"정답(target)은 반드시 다음 영문으로 된 4가지 감정 중 하나여야 합니다: {', '.join(self.ALLOWED_EMOTIONS)}\n"
            "형식: {\"text\": \"상황 설명\", \"target\": \"감정\", \"type\": \"표정 놀이\"}"
        )
        
        try:
            # 새로운 SDK의 콘텐츠 생성 방식
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=1.0,
                    top_p=0.95
                )
            )
            
            # 새 SDK는 response.text를 통해 결과값에 바로 접근 가능합니다.
            data = json.loads(response.text)
            
            if data.get("target") not in self.ALLOWED_EMOTIONS:
                return random.choice(self.DEMO_QUESTIONS)
                
            return data
            
        except Exception as e:
            print(f"Gemini API 오류 (New SDK): {e}")
            return random.choice(self.DEMO_QUESTIONS)

    def explain_emotion(self, emotion: str, situation: str) -> str:
        """새로운 SDK 방식을 사용하여 감정을 설명합니다."""
        prompt = f"상황: {situation}\n'{emotion}' 감정을 어린이에게 따뜻하게 2문장으로 설명해줘."
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text.strip()
        except:
            return "친구의 마음을 이해하는 건 정말 멋진 일이에요!"