package com.marikit.flashcardfrenzy.deck.repository;

import com.marikit.flashcardfrenzy.deck.entity.Deck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeckRepository extends JpaRepository<Deck, UUID> {

    Page<Deck> findByUserId(UUID userId, Pageable pageable);

    Page<Deck> findByUserIdAndTitleContainingIgnoreCase(UUID userId, String title, Pageable pageable);

    Optional<Deck> findByIdAndUserId(UUID id, UUID userId);

    long countByUserId(UUID userId);
}
