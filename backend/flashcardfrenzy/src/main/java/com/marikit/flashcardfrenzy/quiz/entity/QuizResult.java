package com.marikit.flashcardfrenzy.quiz.entity;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.deck.entity.Deck;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quiz_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Deck deck;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "time_spent", nullable = false)
    private Integer timeSpent;

    @CreationTimestamp
    @Column(name = "date_taken", updatable = false)
    private LocalDateTime dateTaken;
}
