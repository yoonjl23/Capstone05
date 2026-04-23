package com.emotion.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmotionResponseDto {

    private String emotion;
    private String emotion_en;
    private double confidence;
    private Map<String, Double> probabilities;
}
