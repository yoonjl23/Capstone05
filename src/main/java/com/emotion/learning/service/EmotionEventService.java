package com.emotion.learning.service;

import com.emotion.learning.dto.EmotionEventDto;
import com.emotion.learning.entity.EmotionCode;
import com.emotion.learning.entity.EmotionEvent;
import com.emotion.learning.entity.GameSession;
import com.emotion.learning.exception.ApiException;
import com.emotion.learning.repository.EmotionEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmotionEventService {

    private final EmotionEventRepository emotionEventRepository;
    private final GameService gameService;

    @Transactional
    public EmotionEventDto.SaveResponse save(EmotionEventDto.SaveRequest request) {
        GameSession session = gameService.getSession(request.getSessionId());

        if (request.getConfidence() < 0 || request.getConfidence() > 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "confidence는 0~1 사이여야 합니다.");
        }

        EmotionEvent event = emotionEventRepository.save(EmotionEvent.builder()
                .session(session)
                .questionId(request.getQuestionId())
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
