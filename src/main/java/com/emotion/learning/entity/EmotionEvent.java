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
@Table(name = "emotion_events")
public class EmotionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private GameSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmotionCode detectedEmotion;

    private Double confidence;

    @Column(nullable = false)
    private LocalDateTime capturedAt;

    @PrePersist
    public void prePersist() {
        if (capturedAt == null) {
            capturedAt = LocalDateTime.now();
        }
    }
}
