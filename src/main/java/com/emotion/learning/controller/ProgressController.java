package com.emotion.learning.controller;

import com.emotion.learning.dto.ProgressDto;
import com.emotion.learning.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "progress", description = "진행도/도감 API")
public class ProgressController {

    private final ProgressService progressService;

    @Operation(summary = "진행도 조회")
    @GetMapping("/{userId}")
    public ResponseEntity<ProgressDto.ProgressResponse> getProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(progressService.getProgress(userId));
    }
}
