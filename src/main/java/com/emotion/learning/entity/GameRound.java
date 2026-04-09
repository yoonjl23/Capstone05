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
@Table(name = "game_rounds")
public class GameRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private GameSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmotionCode detectedEmotion;

    @Column(nullable = false)
    private Boolean correct;

    @Column(nullable = false)
    private Integer earnedScore;

    @Column(nullable = false)
    private Integer earnedExp;

    @Column(nullable = false)
    private Integer roundOrder;

    @Column(nullable = false)
    private LocalDateTime answeredAt;

    @PrePersist
    public void prePersist() {
        if (answeredAt == null) {
            answeredAt = LocalDateTime.now();
        }
    }
}
