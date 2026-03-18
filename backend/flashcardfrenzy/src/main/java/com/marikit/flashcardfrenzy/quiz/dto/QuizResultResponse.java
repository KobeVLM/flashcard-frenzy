package com.marikit.flashcardfrenzy.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {

    private UUID id;
    private UUID deckId;
    private Integer score;
    private Integer timeSpent;
    private String status;
    private LocalDateTime createdAt;
}
