package com.emotion.learning.controller;

import com.emotion.learning.dto.EmotionEventDto;
import com.emotion.learning.service.EmotionEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emotion-events")
@RequiredArgsConstructor
@Tag(name = "emotion-events", description = "감정 이벤트 저장 API")
public class EmotionEventController {

    private final EmotionEventService emotionEventService;

    @Operation(summary = "감정 이벤트 저장")
    @PostMapping
    public ResponseEntity<EmotionEventDto.SaveResponse> save(@RequestBody EmotionEventDto.SaveRequest request) {
        return ResponseEntity.ok(emotionEventService.save(request));
    }
}
