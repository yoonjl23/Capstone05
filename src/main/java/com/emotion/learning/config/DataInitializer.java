package com.emotion.learning.config;

import com.emotion.learning.entity.*;
import com.emotion.learning.repository.CharacterCardRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {
    
    private final CharacterCardRepository characterCardRepository;

    @PostConstruct
    public void init() {
        //initCharacters();
    }

    private void initCharacters() {
        saveCharacter("POTATO_RABBIT", "감자토끼", 1);
        saveCharacter("SMILE_BEAN", "웃콩이", 2);
        saveCharacter("CLOUD_BEAR", "구름곰", 3);
        saveCharacter("RAINBOW_CAT", "무지개냥", 4);
    }

    private void saveCharacter(String code, String name, int requiredLevel) {
        if (characterCardRepository.existsByCode(code)) {
            return;
        }
        characterCardRepository.save(CharacterCard.builder()
                .code(code)
                .name(name)
                .requiredLevel(requiredLevel)
                .build());
    }
}