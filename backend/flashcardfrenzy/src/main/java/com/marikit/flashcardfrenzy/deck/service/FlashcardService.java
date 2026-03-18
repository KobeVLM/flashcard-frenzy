package com.marikit.flashcardfrenzy.deck.service;

import com.marikit.flashcardfrenzy.deck.dto.*;

import java.util.UUID;

public interface FlashcardService {

    CardListResponse getCards(UUID deckId, UUID userId, String role);

    CardResponse addCard(UUID deckId, UUID userId, String role, CreateCardRequest request);

    CardResponse updateCard(UUID cardId, UUID userId, String role, UpdateCardRequest request);

    void deleteCard(UUID cardId, UUID userId, String role);
}
