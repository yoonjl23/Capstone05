package com.emotion.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String userId;
    private String username;
    private Integer level;
    private Integer totalExp;
}
