package com.emotion.learning.repository;

import com.emotion.learning.entity.GameMode;
import com.emotion.learning.entity.GameSession;
import com.emotion.learning.entity.GameSessionStatus;
import com.emotion.learning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    int countByUserAndModeAndStatus(User user, GameMode mode, GameSessionStatus status);
}
