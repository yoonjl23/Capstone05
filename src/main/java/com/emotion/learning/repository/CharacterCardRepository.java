package com.emotion.learning.repository;

import com.emotion.learning.entity.CharacterCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacterCardRepository extends JpaRepository<CharacterCard, Long> {
    boolean existsByCode(String code);
}
