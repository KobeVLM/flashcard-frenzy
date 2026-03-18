package com.marikit.flashcardfrenzy.deck.dto;

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
public class DeckResponse {

    private UUID id;
    private String title;
    private String description;
    private String category;
    private int cardCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
