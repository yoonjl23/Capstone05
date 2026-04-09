package com.emotion.learning.repository;

import com.emotion.learning.entity.GameMode;
import com.emotion.learning.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByModeOrderByOrderNoAsc(GameMode mode);
}
