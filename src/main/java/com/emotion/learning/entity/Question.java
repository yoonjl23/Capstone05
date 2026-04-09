package com.emotion.learning.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameMode mode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmotionCode targetEmotion;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionSource source;

    @Column(nullable = false)
    private Integer orderNo;
}
