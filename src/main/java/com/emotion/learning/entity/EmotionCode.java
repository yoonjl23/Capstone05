package com.emotion.learning.entity;

import java.util.Arrays;

public enum EmotionCode {
    JOY("기쁨", "😊"),
    SADNESS("슬픔", "😢"),
    ANGER("화남", "😠"),
    SURPRISE("놀람", "😲");

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
