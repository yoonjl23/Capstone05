package com.emotion.learning.service;

import com.emotion.learning.dto.QuestionResponseDto;
import com.emotion.learning.entity.Question;
import com.emotion.learning.entity.GameMode;
import com.emotion.learning.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<QuestionResponseDto> getQuestions(String mode) {
        GameMode gameMode = GameMode.valueOf(mode.toUpperCase());
        return questionRepository.findByModeOrderByOrderNoAsc(gameMode)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private QuestionResponseDto toDto(Question question) {
        return QuestionResponseDto.builder()
                .id(question.getId())
                .mode(question.getMode().name())
                .targetEmotionCode(question.getTargetEmotion().name())
                .target(question.getTargetEmotion().getLabel())
                .icon(question.getTargetEmotion().getIcon())
                .text(question.getText())
                .type(question.getType())
                .build();
    }
}
