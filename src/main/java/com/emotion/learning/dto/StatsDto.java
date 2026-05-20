package com.emotion.learning.dto;

import lombok.*;
import java.util.List;

public class StatsDto {

    @Getter @Builder @AllArgsConstructor
    public static class Response {
        private int expressionCount;
        private int inferenceCount;
        private List<EmotionStat> emotions;
    }

    @Builder @Getter @AllArgsConstructor
    public static class EmotionStat {
        private String emotionKey;      // positive, negative
        private int accuracy;           // 정답률
    }
}
