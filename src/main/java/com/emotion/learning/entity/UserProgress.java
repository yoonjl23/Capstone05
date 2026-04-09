package com.emotion.learning.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer totalExp;

    @Column(nullable = false)
    private Integer level;

    @PrePersist
    public void prePersist() {
        if (totalExp == null) totalExp = 0;
        if (level == null) level = 1;
    }
}
