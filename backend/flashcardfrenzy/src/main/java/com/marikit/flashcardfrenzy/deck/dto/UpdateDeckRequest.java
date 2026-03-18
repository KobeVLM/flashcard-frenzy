package com.marikit.flashcardfrenzy.deck.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDeckRequest {

    private String title;

    private String description;

    private String category;
}
