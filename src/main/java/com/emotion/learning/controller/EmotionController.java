package com.emotion.learning.controller;

import com.emotion.learning.dto.EmotionResponseDto;
import com.emotion.learning.service.EmotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emotion")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 테스트를 위해 모든 도메인 허용
public class EmotionController {

    private final EmotionService emotionService;

    @PostMapping("/analyze")
    public ResponseEntity<EmotionResponseDto> analyze(@RequestBody Map<String, String> request) {
        EmotionResponseDto result = emotionService.analyzeWithAi(request);
        return ResponseEntity.ok(result);
    }
}
