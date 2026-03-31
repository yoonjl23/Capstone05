package com.emotion.learning.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {

    @Schema(description = "로그인 아이디", example = "id")
    private String userId;

    @Schema(description = "로그인 비밀번호", example = "pw")
    private String password;
}
