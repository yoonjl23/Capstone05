package com.emotion.learning.repository;

import com.emotion.learning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 아이디로 회원을 찾는 기능
    Optional<User> findByUserId(String userId);

    // 아이디 중복 체크를 위한 기능
    boolean existsByUserId(String userId);
}
