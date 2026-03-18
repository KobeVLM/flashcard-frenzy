package com.marikit.flashcardfrenzy.deck.controller;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import com.marikit.flashcardfrenzy.common.SecurityUtil;
import com.marikit.flashcardfrenzy.deck.dto.*;
import com.marikit.flashcardfrenzy.deck.service.FlashcardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;

    @GetMapping("/api/v1/decks/{id}/cards")
    public ResponseEntity<ApiResponse<CardListResponse>> getCards(@PathVariable UUID id) {
        User currentUser = SecurityUtil.getCurrentUser();
        CardListResponse response = flashcardService.getCards(id, currentUser.getId(), currentUser.getRole().name());
        return ResponseBuilder.success(response);
    }

    @PostMapping("/api/v1/decks/{id}/cards")
    public ResponseEntity<ApiResponse<CardResponse>> addCard(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCardRequest request) {

        User currentUser = SecurityUtil.getCurrentUser();
        CardResponse response = flashcardService.addCard(id, currentUser.getId(), currentUser.getRole().name(), request);
        return ResponseBuilder.created(response);
    }

    @PatchMapping("/api/v1/cards/{cardId}")
    public ResponseEntity<ApiResponse<CardResponse>> updateCard(
            @PathVariable UUID cardId,
            @RequestBody UpdateCardRequest request) {

        User currentUser = SecurityUtil.getCurrentUser();
        CardResponse response = flashcardService.updateCard(cardId, currentUser.getId(), currentUser.getRole().name(), request);
        return ResponseBuilder.success(response);
    }

    @DeleteMapping("/api/v1/cards/{cardId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteCard(@PathVariable UUID cardId) {
        User currentUser = SecurityUtil.getCurrentUser();
        flashcardService.deleteCard(cardId, currentUser.getId(), currentUser.getRole().name());
        return ResponseBuilder.success(Map.of("message", "Card deleted successfully"));
    }
}
