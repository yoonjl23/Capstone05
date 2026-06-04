package com.emotion.learning.service;

import com.emotion.learning.dto.EmotionResponseDto;
import com.emotion.learning.dto.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmotionService {

    private final RestTemplate restTemplate;

    private final String AI_URL = "http://13.236.7.23:5000/predict/frame";
    private final String AI_QUIZ_URL = "http://13.236.7.23:5000/quiz";

    public EmotionResponseDto analyzeWithAi(Map<String, String> request) {
        try {
            // AI 서버로 그대로 반환
            return restTemplate.postForObject(AI_URL, request, EmotionResponseDto.class);
        } catch (Exception e) {
            // 에러 발생 시 예외 처리
            System.out.println("AI 서버 통신 에러: " + e.getMessage());
            return null;
        }
    }

    // 퀴즈 데이터 가져오기
    public QuizResponseDto[] getQuizFromAi() {
        try {
            return restTemplate.getForObject(AI_QUIZ_URL, QuizResponseDto[].class);
        } catch (Exception e) {
            System.out.println("AI 서버 퀴즈 통신 에러: " + e.getMessage());
            return null;
        }
    }
}
