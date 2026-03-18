package com.marikit.flashcardfrenzy.deck.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardResponse {

    private UUID id;
    private UUID deckId;
    private String question;
    private String answer;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
