package com.marikit.flashcardfrenzy.deck.service;

import com.marikit.flashcardfrenzy.deck.dto.*;

import java.util.UUID;

public interface DeckService {

    DeckListResponse getDecks(UUID userId, int page, int limit, String search);

    DeckResponse getDeck(UUID deckId, UUID userId, String role);

    DeckResponse createDeck(UUID userId, CreateDeckRequest request);

    DeckResponse updateDeck(UUID deckId, UUID userId, String role, UpdateDeckRequest request);

    void deleteDeck(UUID deckId, UUID userId, String role);
}
