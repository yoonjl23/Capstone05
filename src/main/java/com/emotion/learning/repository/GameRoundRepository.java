package com.emotion.learning.repository;

import com.emotion.learning.entity.GameRound;
import com.emotion.learning.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRoundRepository extends JpaRepository<GameRound, Long> {
    List<GameRound> findBySessionIdOrderByAnsweredAtAsc(Long sessionId);
    long countBySessionId(Long sessionId);
    List<GameRound> findAllBySession_User(User user);
}
