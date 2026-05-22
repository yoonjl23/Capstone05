package com.emotion.learning.config;

import com.emotion.learning.entity.CharacterCard;
import com.emotion.learning.repository.CharacterCardRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final CharacterCardRepository characterCardRepository;

    @PostConstruct
    public void init() {
        initCharacters();
    }

    private void initCharacters() {
        List<CardSeed> cardSeeds = List.of(
                new CardSeed("BOOK_SPACE_01", "우주탐험대 카드 1", 1, "space-expedition", "card1.png"),
                new CardSeed("BOOK_SPACE_02", "우주탐험대 카드 2", 2, "space-expedition", "card2.png"),
                new CardSeed("BOOK_SPACE_03", "우주탐험대 카드 3", 3, "space-expedition", "card3.png"),
                new CardSeed("BOOK_SPACE_04", "우주탐험대 카드 4", 4, "space-expedition", "card4.png"),
                new CardSeed("BOOK_SPACE_05", "우주탐험대 카드 5", 5, "space-expedition", "card5.png"),
                new CardSeed("BOOK_SPACE_06", "우주탐험대 카드 6", 6, "space-expedition", "card6.png"),
                new CardSeed("BOOK_SPACE_07", "우주탐험대 카드 7", 7, "space-expedition", "card7.png"),
                new CardSeed("BOOK_SPACE_08", "우주탐험대 카드 8", 8, "space-expedition", "card8.png"),
                new CardSeed("BOOK_SPACE_09", "우주탐험대 카드 9", 9, "space-expedition", "card9.png"),
                new CardSeed("BOOK_MUSHROOM_01", "버섯요정마을 카드 1", 10, "mushroom-village", "card1.png"),
                new CardSeed("BOOK_MUSHROOM_02", "버섯요정마을 카드 2", 11, "mushroom-village", "card2.png"),
                new CardSeed("BOOK_MUSHROOM_03", "버섯요정마을 카드 3", 12, "mushroom-village", "card3.png"),
                new CardSeed("BOOK_MUSHROOM_04", "버섯요정마을 카드 4", 13, "mushroom-village", "card4.png"),
                new CardSeed("BOOK_MUSHROOM_05", "버섯요정마을 카드 5", 14, "mushroom-village", "card5.png"),
                new CardSeed("BOOK_MUSHROOM_06", "버섯요정마을 카드 6", 15, "mushroom-village", "card6.png"),
                new CardSeed("BOOK_MUSHROOM_07", "버섯요정마을 카드 7", 16, "mushroom-village", "card7.png"),
                new CardSeed("BOOK_MUSHROOM_08", "버섯요정마을 카드 8", 17, "mushroom-village", "card8.png"),
                new CardSeed("BOOK_MUSHROOM_09", "버섯요정마을 카드 9", 18, "mushroom-village", "card9.png"),
                new CardSeed("BOOK_DEEPSEA_01", "깊은바닷속 카드 1", 19, "deep-sea", "card1.png"),
                new CardSeed("BOOK_DEEPSEA_02", "깊은바닷속 카드 2", 20, "deep-sea", "card2.png"),
                new CardSeed("BOOK_DEEPSEA_03", "깊은바닷속 카드 3", 21, "deep-sea", "card3.png"),
                new CardSeed("BOOK_DEEPSEA_04", "깊은바닷속 카드 4", 22, "deep-sea", "card4.png"),
                new CardSeed("BOOK_DEEPSEA_05", "깊은바닷속 카드 5", 23, "deep-sea", "card5.png"),
                new CardSeed("BOOK_DEEPSEA_06", "깊은바닷속 카드 6", 24, "deep-sea", "card6.png"),
                new CardSeed("BOOK_DEEPSEA_07", "깊은바닷속 카드 7", 25, "deep-sea", "card7.png"),
                new CardSeed("BOOK_DEEPSEA_08", "깊은바닷속 카드 8", 26, "deep-sea", "card8.png"),
                new CardSeed("BOOK_DEEPSEA_09", "깊은바닷속 카드 9", 27, "deep-sea", "card9.png"),
                new CardSeed("BOOK_DRAGON_01", "드래곤왕국 카드 1", 28, "dragon-kingdom", "card1.png"),
                new CardSeed("BOOK_DRAGON_02", "드래곤왕국 카드 2", 29, "dragon-kingdom", "card2.png"),
                new CardSeed("BOOK_DRAGON_03", "드래곤왕국 카드 3", 30, "dragon-kingdom", "card3.png"),
                new CardSeed("BOOK_DRAGON_04", "드래곤왕국 카드 4", 31, "dragon-kingdom", "card4.png"),
                new CardSeed("BOOK_DRAGON_05", "드래곤왕국 카드 5", 32, "dragon-kingdom", "card5.png"),
                new CardSeed("BOOK_DRAGON_06", "드래곤왕국 카드 6", 33, "dragon-kingdom", "card6.png"),
                new CardSeed("BOOK_DRAGON_07", "드래곤왕국 카드 7", 34, "dragon-kingdom", "card7.png"),
                new CardSeed("BOOK_DRAGON_08", "드래곤왕국 카드 8", 35, "dragon-kingdom", "card8.png"),
                new CardSeed("BOOK_DRAGON_09", "드래곤왕국 카드 9", 36, "dragon-kingdom", "card9.png")
        );

        for (CardSeed cardSeed : cardSeeds) {
            saveCharacter(cardSeed);
        }
    }

    private void saveCharacter(CardSeed seed) {
        CharacterCard characterCard = characterCardRepository.findByCode(seed.code())
                .orElseGet(CharacterCard::new);

        characterCard.setCode(seed.code());
        characterCard.setName(seed.name());
        characterCard.setRequiredLevel(seed.requiredLevel());
        characterCard.setThemeCode(seed.themeCode());
        characterCard.setImageName(seed.imageName());

        characterCardRepository.save(characterCard);
    }

    private record CardSeed(
            String code,
            String name,
            int requiredLevel,
            String themeCode,
            String imageName
    ) {
    }
}
