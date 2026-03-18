package com.marikit.flashcardfrenzy.deck.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCardRequest {

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Answer is required")
    private String answer;

    private List<String> tags;
}
