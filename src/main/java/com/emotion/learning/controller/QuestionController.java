package com.emotion.learning.controller;

import com.emotion.learning.dto.QuestionResponseDto;
import com.emotion.learning.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "questions", description = "문제 조회 API")
public class QuestionController {

    private final QuestionService questionService;

    @Operation(summary = "문제 목록 조회", description = "mode=EXPRESSION 또는 INFERENCE")
    @GetMapping
    public ResponseEntity<List<QuestionResponseDto>> getQuestions(@RequestParam String mode) {
        return ResponseEntity.ok(questionService.getQuestions(mode));
    }
}
