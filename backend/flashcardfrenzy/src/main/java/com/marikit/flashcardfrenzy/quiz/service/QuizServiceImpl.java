package com.marikit.flashcardfrenzy.quiz.service;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.common.AppException;
import com.marikit.flashcardfrenzy.deck.entity.Deck;
import com.marikit.flashcardfrenzy.deck.repository.DeckRepository;
import com.marikit.flashcardfrenzy.quiz.dto.*;
import com.marikit.flashcardfrenzy.quiz.entity.QuizResult;
import com.marikit.flashcardfrenzy.quiz.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizResultRepository quizResultRepository;
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public QuizResultResponse submitResult(UUID userId, QuizResultRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "User not found",
                        HttpStatus.NOT_FOUND));

        Deck deck = deckRepository.findById(request.getDeckId())
                .orElseThrow(() -> new AppException(
                        "DB-001",
                        "Deck not found",
                        HttpStatus.NOT_FOUND));

        // Persist only — do not re-validate answers server-side
        QuizResult quizResult = QuizResult.builder()
                .user(user)
                .deck(deck)
                .score(request.getScore())
                .timeSpent(request.getTimeSpent())
                .build();

        quizResult = quizResultRepository.save(quizResult);

        return QuizResultResponse.builder()
                .id(quizResult.getId())
                .deckId(deck.getId())
                .score(quizResult.getScore())
                .timeSpent(quizResult.getTimeSpent())
                .status("completed")
                .createdAt(quizResult.getDateTaken())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public QuizHistoryResponse getHistory(UUID userId) {
        List<QuizResult> results = quizResultRepository.findByUserId(userId);

        List<QuizHistoryItem> items = results.stream()
                .map(result -> QuizHistoryItem.builder()
                        .id(result.getId())
                        .deckId(result.getDeck().getId())
                        .deckTitle(result.getDeck().getTitle())
                        .score(result.getScore())
                        .timeSpent(result.getTimeSpent())
                        .createdAt(result.getDateTaken())
                        .build())
                .toList();

        return QuizHistoryResponse.builder()
                .results(items)
                .build();
    }
}
