package com.emotion.learning.config;

import com.emotion.learning.entity.*;
import com.emotion.learning.repository.CharacterCardRepository;
import com.emotion.learning.repository.QuestionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final QuestionRepository questionRepository;
    private final CharacterCardRepository characterCardRepository;

    @PostConstruct
    public void init() {
        initQuestions();
        initCharacters();
    }

    private void initQuestions() {
        if (questionRepository.count() > 0) {
            return;
        }

        saveQuestion(GameMode.EXPRESSION, EmotionCode.JOY, "방긋! 세상에서 가장 기쁜 표정을 지어볼까요?", "감정 표현하기", 1);
        saveQuestion(GameMode.EXPRESSION, EmotionCode.ANGER, "으으으~ 너무 화가 났을 때 어떤 표정일까요?", "감정 표현하기", 2);
        saveQuestion(GameMode.EXPRESSION, EmotionCode.SADNESS, "눈물이 핑~ 슬픈 표정을 지어보아요.", "감정 표현하기", 3);
        saveQuestion(GameMode.EXPRESSION, EmotionCode.SURPRISE, "입이 쩍! 깜짝 놀란 표정을 지어볼까요?", "감정 표현하기", 4);
        saveQuestion(GameMode.EXPRESSION, EmotionCode.JOY, "행복한 생각만 가득! 활짝 웃어보아요!", "감정 표현하기", 5);

        saveQuestion(GameMode.INFERENCE, EmotionCode.JOY, "내가 친구에게 선물을 줬어요. 친구의 마음은 어떨까요?", "상황별 표정짓기", 1);
        saveQuestion(GameMode.INFERENCE, EmotionCode.SADNESS, "소중한 사탕을 바닥에 떨어뜨렸어요. 어떤 마음이 들까요?", "상황별 표정짓기", 2);
        saveQuestion(GameMode.INFERENCE, EmotionCode.SURPRISE, "갑자기 뒤에서 친구가 왁! 하고 나타났어요!", "상황별 표정짓기", 3);
        saveQuestion(GameMode.INFERENCE, EmotionCode.ANGER, "누가 내 그림을 마음대로 낙서했어요. 기분이 어떨까요?", "상황별 표정짓기", 4);
        saveQuestion(GameMode.INFERENCE, EmotionCode.JOY, "드디어 먹고 싶던 아이스크림을 샀어요! 기분이 어때요?", "상황별 표정짓기", 5);
    }

    private void saveQuestion(GameMode mode, EmotionCode targetEmotion, String text, String type, int orderNo) {
        questionRepository.save(Question.builder()
                .mode(mode)
                .targetEmotion(targetEmotion)
                .text(text)
                .type(type)
                .source(QuestionSource.STATIC)
                .orderNo(orderNo)
                .build());
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
