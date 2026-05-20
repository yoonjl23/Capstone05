package com.emotion.learning.service;

import com.emotion.learning.dto.StatsDto;
import com.emotion.learning.entity.*;
import com.emotion.learning.repository.GameRoundRepository;
import com.emotion.learning.repository.GameSessionRepository;
import com.emotion.learning.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StatsService {

    private final UserRepository userRepository;
    private final GameSessionRepository gameSessionRepository;
    private final GameRoundRepository gameRoundRepository;

    public StatsDto.Response getUserStats(String loginId) {
        User user = userRepository.findByUserId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        int expressionCount = gameSessionRepository.countByUserAndModeAndStatus(
                user, GameMode.EXPRESSION, GameSessionStatus.FINISHED
        );
        int inferenceCount = gameSessionRepository.countByUserAndModeAndStatus(
                user, GameMode.INFERENCE, GameSessionStatus.FINISHED
        );

        List<GameRound> allRounds = gameRoundRepository.findAllBySession_User(user);

        List<StatsDto.EmotionStat> emotionStats = new ArrayList<>();
        EmotionCode[] targetEmotions = {EmotionCode.POSITIVE, EmotionCode.NEGATIVE, EmotionCode.SURPRISE, EmotionCode.NEUTRAL};

        for (EmotionCode emotion : targetEmotions) {
            long totalAttempts = allRounds.stream()
                    .filter(r -> r.getDetectedEmotion() == emotion)
                    .count();

            long correctAttempts = allRounds.stream()
                    .filter(r -> r.getDetectedEmotion() == emotion && r.getCorrect())
                    .count();

            int accuracy = totalAttempts == 0 ? 0 : (int) Math.round((double)correctAttempts / totalAttempts * 100);

            emotionStats.add(new StatsDto.EmotionStat(emotion.name().toLowerCase(), accuracy));
        }

        return StatsDto.Response.builder()
                .expressionCount(expressionCount)
                .inferenceCount(inferenceCount)
                .emotions(emotionStats)
                .build();
    }
}
