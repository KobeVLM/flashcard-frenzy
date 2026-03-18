package com.marikit.flashcardfrenzy.deck.controller;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import com.marikit.flashcardfrenzy.common.SecurityUtil;
import com.marikit.flashcardfrenzy.deck.dto.*;
import com.marikit.flashcardfrenzy.deck.service.DeckService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/decks")
@RequiredArgsConstructor
public class DeckController {

    private final DeckService deckService;

    @GetMapping
    public ResponseEntity<ApiResponse<DeckListResponse>> getDecks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search) {

        User currentUser = SecurityUtil.getCurrentUser();
        DeckListResponse response = deckService.getDecks(currentUser.getId(), page, limit, search);
        return ResponseBuilder.success(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeckResponse>> getDeck(@PathVariable UUID id) {
        User currentUser = SecurityUtil.getCurrentUser();
        DeckResponse response = deckService.getDeck(id, currentUser.getId(), currentUser.getRole().name());
        return ResponseBuilder.success(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DeckResponse>> createDeck(@Valid @RequestBody CreateDeckRequest request) {
        User currentUser = SecurityUtil.getCurrentUser();
        DeckResponse response = deckService.createDeck(currentUser.getId(), request);
        return ResponseBuilder.created(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<DeckResponse>> updateDeck(
            @PathVariable UUID id,
            @RequestBody UpdateDeckRequest request) {

        User currentUser = SecurityUtil.getCurrentUser();
        DeckResponse response = deckService.updateDeck(id, currentUser.getId(), currentUser.getRole().name(), request);
        return ResponseBuilder.success(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteDeck(@PathVariable UUID id) {
        User currentUser = SecurityUtil.getCurrentUser();
        deckService.deleteDeck(id, currentUser.getId(), currentUser.getRole().name());
        return ResponseBuilder.success(Map.of("message", "Deck deleted successfully"));
    }
}
