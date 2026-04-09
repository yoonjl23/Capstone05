package com.emotion.learning.service;

import com.emotion.learning.dto.EmotionEventDto;
import com.emotion.learning.entity.EmotionCode;
import com.emotion.learning.entity.EmotionEvent;
import com.emotion.learning.entity.GameSession;
import com.emotion.learning.entity.Question;
import com.emotion.learning.exception.ApiException;
import com.emotion.learning.repository.EmotionEventRepository;
import com.emotion.learning.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmotionEventService {

    private final EmotionEventRepository emotionEventRepository;
    private final QuestionRepository questionRepository;
    private final GameService gameService;

    @Transactional
    public EmotionEventDto.SaveResponse save(EmotionEventDto.SaveRequest request) {
        GameSession session = gameService.getSession(request.getSessionId());
        Question question = null;
        if (request.getQuestionId() != null) {
            question = questionRepository.findById(request.getQuestionId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));
        }

        EmotionEvent event = emotionEventRepository.save(EmotionEvent.builder()
                .session(session)
                .question(question)
                .detectedEmotion(EmotionCode.fromLabel(request.getDetectedEmotion()))
                .confidence(request.getConfidence())
                .capturedAt(request.getCapturedAt())
                .build());

        return EmotionEventDto.SaveResponse.builder()
                .eventId(event.getId())
                .sessionId(session.getId())
                .detectedEmotion(event.getDetectedEmotion().getLabel())
                .confidence(event.getConfidence())
                .capturedAt(event.getCapturedAt())
                .build();
    }
}
