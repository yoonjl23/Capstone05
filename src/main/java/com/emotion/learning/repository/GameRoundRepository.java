package com.emotion.learning.repository;

import com.emotion.learning.entity.GameRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRoundRepository extends JpaRepository<GameRound, Long> {
    List<GameRound> findBySessionIdOrderByRoundOrderAsc(Long sessionId);
    long countBySessionId(Long sessionId);
}
