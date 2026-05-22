package com.emotion.learning.repository;

import com.emotion.learning.entity.CharacterCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CharacterCardRepository extends JpaRepository<CharacterCard, Long> {
    boolean existsByCode(String code);
    Optional<CharacterCard> findByCode(String code);
    List<CharacterCard> findByCodeStartingWithOrderByRequiredLevelAsc(String codePrefix);
}
