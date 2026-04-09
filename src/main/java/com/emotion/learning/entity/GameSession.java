package com.emotion.learning.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "game_sessions")
public class GameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameMode mode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameSessionStatus status;

    @Column(nullable = false)
    private Integer totalQuestions;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer earnedExp;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    @PrePersist
    public void prePersist() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = GameSessionStatus.IN_PROGRESS;
        }
        if (score == null) {
            score = 0;
        }
        if (earnedExp == null) {
            earnedExp = 0;
        }
        if (totalQuestions == null) {
            totalQuestions = 5;
        }
    }
}
