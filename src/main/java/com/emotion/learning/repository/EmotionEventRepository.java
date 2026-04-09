package com.emotion.learning.repository;

import com.emotion.learning.entity.EmotionEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionEventRepository extends JpaRepository<EmotionEvent, Long> {
}
