package com.emotion.learning.controller;

import com.emotion.learning.dto.*;
import com.emotion.learning.service.ProgressService;
import com.emotion.learning.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "users", description = "사용자 관리 API")
public class UserController {

    private final UserService userService;
    private final ProgressService progressService;

    @Operation(summary = "회원가입", description = "새로운 유저 등록")
    @PostMapping("/register")
    public ResponseEntity<Long> register(@RequestBody SignupRequestDto dto) {
        return ResponseEntity.ok(userService.register(dto));
    }

    @Operation(summary = "로그인", description = "아이디와 비밀번호로 로그인")
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDto dto) {
        var user = userService.login(dto.getUserId(), dto.getPassword());
        UserProfileDto profile = progressService.getProfileByUserId(user.getUserId());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "로그인 성공");
        response.put("user", profile);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "내 정보", description = "로그인 아이디로 사용자 프로필 조회")
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> me(@RequestParam String userId) {
        return ResponseEntity.ok(progressService.getProfileByUserId(userId));
    }
}
