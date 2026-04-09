package com.emotion.learning.entity;

public enum GameMode {
    EXPRESSION,
    INFERENCE;

    public String getDisplayName() {
        return this == EXPRESSION ? "감정 표현하기" : "상황별 표정짓기";
    }
}
