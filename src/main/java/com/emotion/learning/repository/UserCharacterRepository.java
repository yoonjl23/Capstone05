package com.emotion.learning.repository;

import com.emotion.learning.entity.UserCharacter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCharacterRepository extends JpaRepository<UserCharacter, Long> {
    List<UserCharacter> findByUserId(Long userId);
    boolean existsByUserIdAndCharacterCardId(Long userId, Long characterId);
}
