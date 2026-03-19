package com.marikit.flashcardfrenzy.admin.service;

import com.marikit.flashcardfrenzy.admin.dto.*;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.common.AppException;
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
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus("ACTIVE");
        long totalDecks = deckRepository.count();
        long totalCards = flashcardRepository.count();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalDecks(totalDecks)
                .totalCards(totalCards)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserListResponse getUsers() {
        List<User> users = userRepository.findAll();

        List<AdminUserResponse> userResponses = users.stream()
                .map(user -> AdminUserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .role(user.getRole().name())
                        .status(user.getStatus())
                        .deckCount(deckRepository.countByUserId(user.getId()))
                        .createdAt(user.getCreatedAt())
                        .build())
                .toList();

        return AdminUserListResponse.builder()
                .users(userResponses)
                .total(users.size())
                .build();
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "User not found",
                        HttpStatus.NOT_FOUND));

        user.setStatus(request.getStatus());
        user = userRepository.save(user);

        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .status(user.getStatus())
                .deckCount(deckRepository.countByUserId(user.getId()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteUser(UUID userId, UUID adminId) {
        // Admin self-delete guard
        if (userId.equals(adminId)) {
            throw new AppException(
                    "AUTH-003",
                    "Admin cannot delete their own account",
                    HttpStatus.FORBIDDEN);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "User not found",
                        HttpStatus.NOT_FOUND));

        // JPA cascade handles deletion of decks, flashcards, and quiz results
        userRepository.delete(user);
    }
}
