package com.emotion.learning.service;

import com.emotion.learning.dto.EmotionResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmotionService {

    private final RestTemplate restTemplate;
    // Docker Compose 서비스 이름사용
    private final String AI_URL = "http://ai-server:5000/predict/frame";

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
}
