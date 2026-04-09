package com.emotion.learning.controller;

import com.emotion.learning.dto.GameSessionDto;
import com.emotion.learning.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game-sessions")
@RequiredArgsConstructor
@Tag(name = "game-sessions", description = "게임 세션 API")
public class GameSessionController {

    private final GameService gameService;

    @Operation(summary = "게임 시작")
    @PostMapping("/start")
    public ResponseEntity<GameSessionDto.StartResponse> start(@RequestBody GameSessionDto.StartRequest request) {
        return ResponseEntity.ok(gameService.start(request));
    }

    @Operation(summary = "답안 제출")
    @PostMapping("/{sessionId}/answers")
    public ResponseEntity<GameSessionDto.SubmitAnswerResponse> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody GameSessionDto.SubmitAnswerRequest request
    ) {
        return ResponseEntity.ok(gameService.submitAnswer(sessionId, request));
    }

    @Operation(summary = "게임 종료")
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<GameSessionDto.ResultResponse> finish(@PathVariable Long sessionId) {
        return ResponseEntity.ok(gameService.finish(sessionId));
    }

    @Operation(summary = "게임 결과 조회")
    @GetMapping("/{sessionId}/result")
    public ResponseEntity<GameSessionDto.ResultResponse> result(@PathVariable Long sessionId) {
        return ResponseEntity.ok(gameService.getResult(sessionId));
    }
}
