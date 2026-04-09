package com.emotion.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class QuestionResponseDto {
    private Long id;
    private String mode;
    private String targetEmotionCode;
    private String target;
    private String icon;
    private String text;
    private String type;
}
