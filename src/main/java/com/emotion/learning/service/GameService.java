package com.emotion.learning.service;

import com.emotion.learning.dto.GameSessionDto;
import com.emotion.learning.entity.*;
import com.emotion.learning.exception.ApiException;
import com.emotion.learning.repository.GameRoundRepository;
import com.emotion.learning.repository.GameSessionRepository;
import com.emotion.learning.repository.QuestionRepository;
import com.emotion.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GameService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final GameSessionRepository gameSessionRepository;
    private final GameRoundRepository gameRoundRepository;
    private final ProgressService progressService;

    @Transactional
    public GameSessionDto.StartResponse start(GameSessionDto.StartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
        GameMode mode = GameMode.valueOf(request.getMode().toUpperCase());
        int totalQuestions = questionRepository.findByModeOrderByOrderNoAsc(mode).size();

        GameSession session = gameSessionRepository.save(GameSession.builder()
                .user(user)
                .mode(mode)
                .status(GameSessionStatus.IN_PROGRESS)
                .totalQuestions(totalQuestions)
                .score(0)
                .earnedExp(0)
                .build());

        return GameSessionDto.StartResponse.builder()
                .sessionId(session.getId())
                .userId(user.getId())
                .mode(session.getMode().name())
                .status(session.getStatus().name())
                .totalQuestions(session.getTotalQuestions())
                .startedAt(session.getStartedAt())
                .build();
    }

    @Transactional
    public GameSessionDto.SubmitAnswerResponse submitAnswer(Long sessionId, GameSessionDto.SubmitAnswerRequest request) {
        GameSession session = getSession(sessionId);
        if (session.getStatus() == GameSessionStatus.FINISHED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "이미 종료된 게임입니다.");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "문제를 찾을 수 없습니다."));

        EmotionCode detectedEmotion = EmotionCode.fromLabel(request.getDetectedEmotion());
        boolean correct = question.getTargetEmotion() == detectedEmotion;
        int earnedScore = correct ? 1 : 0;
        int earnedExp = correct ? 10 : 2;
        int roundOrder = (int) gameRoundRepository.countBySessionId(sessionId) + 1;

        gameRoundRepository.save(GameRound.builder()
                .session(session)
                .question(question)
                .detectedEmotion(detectedEmotion)
                .correct(correct)
                .earnedScore(earnedScore)
                .earnedExp(earnedExp)
                .roundOrder(roundOrder)
                .answeredAt(LocalDateTime.now())
                .build());

        session.setScore(session.getScore() + earnedScore);
        session.setEarnedExp(session.getEarnedExp() + earnedExp);
        gameSessionRepository.save(session);

        UserProgress progress = progressService.addExp(session.getUser(), earnedExp);

        return GameSessionDto.SubmitAnswerResponse.builder()
                .correct(correct)
                .earnedScore(earnedScore)
                .earnedExp(earnedExp)
                .totalScore(session.getScore())
                .totalExp(progress.getTotalExp())
                .currentLevel(progress.getLevel())
                .build();
    }

    @Transactional
    public GameSessionDto.ResultResponse finish(Long sessionId) {
        GameSession session = getSession(sessionId);
        session.setStatus(GameSessionStatus.FINISHED);
        session.setEndedAt(LocalDateTime.now());
        gameSessionRepository.save(session);
        return getResult(sessionId);
    }

    public GameSessionDto.ResultResponse getResult(Long sessionId) {
        GameSession session = getSession(sessionId);
        List<GameSessionDto.RoundResult> rounds = gameRoundRepository.findBySessionIdOrderByRoundOrderAsc(sessionId)
                .stream()
                .map(round -> GameSessionDto.RoundResult.builder()
                        .roundOrder(round.getRoundOrder())
                        .questionId(round.getQuestion().getId())
                        .questionText(round.getQuestion().getText())
                        .targetEmotion(round.getQuestion().getTargetEmotion().getLabel())
                        .detectedEmotion(round.getDetectedEmotion().getLabel())
                        .correct(round.getCorrect())
                        .earnedScore(round.getEarnedScore())
                        .earnedExp(round.getEarnedExp())
                        .answeredAt(round.getAnsweredAt())
                        .build())
                .toList();

        int correctCount = (int) rounds.stream().filter(GameSessionDto.RoundResult::getCorrect).count();
        int totalQuestions = Math.max(session.getTotalQuestions(), 1);
        int accuracy = (int) Math.round(correctCount * 100.0 / totalQuestions);

        return GameSessionDto.ResultResponse.builder()
                .sessionId(session.getId())
                .mode(session.getMode().name())
                .status(session.getStatus().name())
                .totalQuestions(session.getTotalQuestions())
                .correctCount(correctCount)
                .score(session.getScore())
                .earnedExp(session.getEarnedExp())
                .accuracy(accuracy)
                .rounds(rounds)
                .build();
    }

    public GameSession getSession(Long sessionId) {
        return gameSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "게임 세션을 찾을 수 없습니다."));
    }
}
