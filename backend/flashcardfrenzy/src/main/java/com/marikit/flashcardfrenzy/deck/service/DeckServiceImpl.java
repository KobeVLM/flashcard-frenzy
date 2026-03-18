package com.marikit.flashcardfrenzy.deck.service;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.common.AppException;
import com.marikit.flashcardfrenzy.deck.dto.*;
import com.marikit.flashcardfrenzy.deck.entity.Deck;
import com.marikit.flashcardfrenzy.deck.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeckServiceImpl implements DeckService {

    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DeckListResponse getDecks(UUID userId, int page, int limit, String search) {
        // Convert 1-based page to 0-based for Spring Data
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Deck> deckPage;
        if (search != null && !search.isBlank()) {
            deckPage = deckRepository.findByUserIdAndTitleContainingIgnoreCase(userId, search, pageable);
        } else {
            deckPage = deckRepository.findByUserId(userId, pageable);
        }

        List<DeckResponse> deckResponses = deckPage.getContent().stream()
                .map(this::toDeckResponse)
                .toList();

        DeckListResponse.PaginationMeta pagination = DeckListResponse.PaginationMeta.builder()
                .page(page)
                .limit(limit)
                .total(deckPage.getTotalElements())
                .pages(deckPage.getTotalPages())
                .build();

        return DeckListResponse.builder()
                .decks(deckResponses)
                .pagination(pagination)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DeckResponse getDeck(UUID deckId, UUID userId, String role) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Deck not found",
                        HttpStatus.NOT_FOUND));

        checkOwnership(deck, userId, role);

        return toDeckResponse(deck);
    }

    @Override
    @Transactional
    public DeckResponse createDeck(UUID userId, CreateDeckRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "User not found",
                        HttpStatus.NOT_FOUND));

        Deck deck = Deck.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .build();

        deck = deckRepository.save(deck);
        return toDeckResponse(deck);
    }

    @Override
    @Transactional
    public DeckResponse updateDeck(UUID deckId, UUID userId, String role, UpdateDeckRequest request) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Deck not found",
                        HttpStatus.NOT_FOUND));

        checkOwnership(deck, userId, role);

        // PATCH semantics — only update non-null fields
        if (request.getTitle() != null) {
            deck.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            deck.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            deck.setCategory(request.getCategory());
        }

        deck = deckRepository.save(deck);
        return toDeckResponse(deck);
    }

    @Override
    @Transactional
    public void deleteDeck(UUID deckId, UUID userId, String role) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Deck not found",
                        HttpStatus.NOT_FOUND));

        checkOwnership(deck, userId, role);

        // JPA cascade handles flashcard deletion
        deckRepository.delete(deck);
    }

    /**
     * Ownership check: returns 403 if the deck belongs to another user.
     * ADMIN role bypasses this check.
     */
    private void checkOwnership(Deck deck, UUID userId, String role) {
        if (!"ADMIN".equals(role) && !deck.getUser().getId().equals(userId)) {
            throw new AppException(
                    "AUTH-003",
                    "You do not have permission to access this resource",
                    HttpStatus.FORBIDDEN);
        }
    }

    private DeckResponse toDeckResponse(Deck deck) {
        return DeckResponse.builder()
                .id(deck.getId())
                .title(deck.getTitle())
                .description(deck.getDescription())
                .category(deck.getCategory())
                .cardCount(deck.getFlashcards() != null ? deck.getFlashcards().size() : 0)
                .createdAt(deck.getCreatedAt())
                .updatedAt(deck.getUpdatedAt())
                .build();
    }
}
