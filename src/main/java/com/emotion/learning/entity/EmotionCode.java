package com.emotion.learning.entity;

import java.util.Arrays;

public enum EmotionCode {
    POSITIVE("기분이 좋아요!", "😄"),
    NEGATIVE("기분이 안좋아요...", "😢"),
    SURPRISE("깜짝 놀랐어요!", "😲"),
    NEUTRAL("평온해요", "😐");

    private final String label;
    private final String icon;

    EmotionCode(String label, String icon) {
        this.label = label;
        this.icon = icon;
    }

    public String getLabel() {
        return label;
    }

    public String getIcon() {
        return icon;
    }

    public static EmotionCode fromLabel(String value) {
        return Arrays.stream(values())
                .filter(code -> code.name().equalsIgnoreCase(value) || code.label.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 감정입니다: " + value));
    }
}
