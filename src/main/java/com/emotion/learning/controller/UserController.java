package com.emotion.learning.controller;

import com.emotion.learning.dto.LoginRequestDto;
import com.emotion.learning.dto.SignupRequestDto;
import com.emotion.learning.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "users", description = "사용자 관리 API")
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원가입", description = "새로운 유저 등록")
    @PostMapping("/register")
    public ResponseEntity<Long> register(@RequestBody SignupRequestDto dto) {
        return ResponseEntity.ok(userService.register(dto));
    }
    
    @Operation(summary = "로그인", description = "아이디와 비밀번호로 로그인")
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto dto) {
        userService.login(dto.getUserId(), dto.getPassword());
        return ResponseEntity.ok("로그인 성공");
    }
}
