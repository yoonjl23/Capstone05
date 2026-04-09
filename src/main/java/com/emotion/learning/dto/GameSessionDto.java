package com.emotion.learning.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class GameSessionDto {

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StartRequest {
        private Long userId;
        private String mode;
    }

    @Getter @Builder @AllArgsConstructor
    public static class StartResponse {
        private Long sessionId;
        private Long userId;
        private String mode;
        private String status;
        private Integer totalQuestions;
        private LocalDateTime startedAt;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SubmitAnswerRequest {
        private Long questionId;
        private String detectedEmotion;
    }

    @Getter @Builder @AllArgsConstructor
    public static class SubmitAnswerResponse {
        private Boolean correct;
        private Integer earnedScore;
        private Integer earnedExp;
        private Integer totalScore;
        private Integer totalExp;
        private Integer currentLevel;
    }

    @Getter @Builder @AllArgsConstructor
    public static class RoundResult {
        private Integer roundOrder;
        private Long questionId;
        private String questionText;
        private String targetEmotion;
        private String detectedEmotion;
        private Boolean correct;
        private Integer earnedScore;
        private Integer earnedExp;
        private LocalDateTime answeredAt;
    }

    @Getter @Builder @AllArgsConstructor
    public static class ResultResponse {
        private Long sessionId;
        private String mode;
        private String status;
        private Integer totalQuestions;
        private Integer correctCount;
        private Integer score;
        private Integer earnedExp;
        private Integer accuracy;
        private List<RoundResult> rounds;
    }
}
