package com.emotion.learning.service;

import com.emotion.learning.dto.SignupRequestDto;
import com.emotion.learning.entity.User;
import com.emotion.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입
    public Long register(SignupRequestDto dto) {

        // 1. 아이디 중복 체크
        if(userRepository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        
        // 2. 비밀번호 확인 체크
        if(!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        User user = User.builder()
                .userId(dto.getUserId())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))        // 암호화하여 저장해야 함
                .build();

        return userRepository.save(user).getId();
    }

    // 로그인
    public User login(String userId, String password) {
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));
        
        // 암호화된 비밀번호 비교
        if(!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        return user;
    }
}
