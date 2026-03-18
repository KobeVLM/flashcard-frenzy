package com.marikit.flashcardfrenzy.quiz.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultRequest {

    @NotNull(message = "Deck ID is required")
    private UUID deckId;

    @NotNull(message = "Score is required")
    private Integer score;

    @NotNull(message = "Time spent is required")
    private Integer timeSpent;

    private List<QuizItemResult> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuizItemResult {
        private UUID cardId;
        private String userAnswer;
        private boolean correct;
    }
}
