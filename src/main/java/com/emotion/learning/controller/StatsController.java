package com.emotion.learning.controller;

import com.emotion.learning.dto.StatsDto;
import com.emotion.learning.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/{loginId}")
    public ResponseEntity<StatsDto.Response> getStats(@PathVariable String loginId) {
        return ResponseEntity.ok(statsService.getUserStats(loginId));
    }
}
