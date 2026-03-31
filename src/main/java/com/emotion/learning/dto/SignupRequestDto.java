package com.emotion.learning.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignupRequestDto {

    @Schema(description = "아이디", example = "id")
    private String userId;

    @Schema(description = "비밀번호", example = "pw")
    private String password;

    @Schema(description = "비밀번호 확인", example = "pwCheck")
    private String confirmPassword;

    @Schema(description = "유저 이름", example = "name")
    private String username;
}
