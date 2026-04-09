package com.emotion.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

public class ProgressDto {

    @Getter @Builder @AllArgsConstructor
    public static class CharacterDto {
        private Long id;
        private String code;
        private String name;
        private Integer requiredLevel;
        private Boolean unlocked;
    }

    @Getter @Builder @AllArgsConstructor
    public static class ProgressResponse {
        private Long userId;
        private Integer level;
        private Integer totalExp;
        private Integer nextLevelExp;
        private List<CharacterDto> characters;
    }
}
