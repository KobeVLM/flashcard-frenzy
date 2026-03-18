package com.marikit.flashcardfrenzy.deck.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCardRequest {

    private String question;

    private String answer;

    private List<String> tags;
}
