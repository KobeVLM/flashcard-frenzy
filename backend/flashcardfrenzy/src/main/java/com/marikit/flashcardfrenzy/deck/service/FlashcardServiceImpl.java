package com.marikit.flashcardfrenzy.deck.service;

import com.marikit.flashcardfrenzy.common.AppException;
import com.marikit.flashcardfrenzy.deck.dto.*;
import com.marikit.flashcardfrenzy.deck.entity.Deck;
import com.marikit.flashcardfrenzy.deck.entity.Flashcard;
import com.marikit.flashcardfrenzy.deck.repository.DeckRepository;
import com.marikit.flashcardfrenzy.deck.repository.FlashcardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlashcardServiceImpl implements FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final DeckRepository deckRepository;

    @Override
    @Transactional(readOnly = true)
    public CardListResponse getCards(UUID deckId, UUID userId, String role) {
        findDeckAndCheckOwnership(deckId, userId, role);

        List<CardResponse> cards = flashcardRepository.findByDeckId(deckId).stream()
                .map(this::toCardResponse)
                .toList();

        return CardListResponse.builder()
                .cards(cards)
                .build();
    }

    @Override
    @Transactional
    public CardResponse addCard(UUID deckId, UUID userId, String role, CreateCardRequest request) {
        Deck deck = findDeckAndCheckOwnership(deckId, userId, role);

        Flashcard flashcard = Flashcard.builder()
                .deck(deck)
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .tags(request.getTags())
                .build();

        flashcard = flashcardRepository.save(flashcard);
        return toCardResponse(flashcard);
    }

    @Override
    @Transactional
    public CardResponse updateCard(UUID cardId, UUID userId, String role, UpdateCardRequest request) {
        Flashcard flashcard = flashcardRepository.findById(cardId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Card not found",
                        HttpStatus.NOT_FOUND));

        // Ownership check through parent deck
        checkDeckOwnership(flashcard.getDeck(), userId, role);

        // PATCH semantics — only update non-null fields
        if (request.getQuestion() != null) {
            flashcard.setQuestion(request.getQuestion());
        }
        if (request.getAnswer() != null) {
            flashcard.setAnswer(request.getAnswer());
        }
        if (request.getTags() != null) {
            flashcard.setTags(request.getTags());
        }

        flashcard = flashcardRepository.save(flashcard);
        return toCardResponse(flashcard);
    }

    @Override
    @Transactional
    public void deleteCard(UUID cardId, UUID userId, String role) {
        Flashcard flashcard = flashcardRepository.findById(cardId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Card not found",
                        HttpStatus.NOT_FOUND));

        // Ownership check through parent deck
        checkDeckOwnership(flashcard.getDeck(), userId, role);

        flashcardRepository.delete(flashcard);
    }

    private Deck findDeckAndCheckOwnership(UUID deckId, UUID userId, String role) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Deck not found",
                        HttpStatus.NOT_FOUND));

        checkDeckOwnership(deck, userId, role);
        return deck;
    }

    private void checkDeckOwnership(Deck deck, UUID userId, String role) {
        if (!"ADMIN".equals(role) && !deck.getUser().getId().equals(userId)) {
            throw new AppException(
                    "AUTH-003",
                    "You do not have permission to access this resource",
                    HttpStatus.FORBIDDEN);
        }
    }

    private CardResponse toCardResponse(Flashcard flashcard) {
        return CardResponse.builder()
                .id(flashcard.getId())
                .deckId(flashcard.getDeck().getId())
                .question(flashcard.getQuestion())
                .answer(flashcard.getAnswer())
                .tags(flashcard.getTags())
                .createdAt(flashcard.getCreatedAt())
                .updatedAt(flashcard.getUpdatedAt())
                .build();
    }
}
