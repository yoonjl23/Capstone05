package com.emotion.learning.dto;

import lombok.*;

import java.time.LocalDateTime;

public class EmotionEventDto {

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SaveRequest {
        private Long sessionId;
        private Long questionId;
        private String detectedEmotion;
        private Double confidence;
        private LocalDateTime capturedAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class SaveResponse {
        private Long eventId;
        private Long sessionId;
        private String detectedEmotion;
        private Double confidence;
        private LocalDateTime capturedAt;
    }
}
