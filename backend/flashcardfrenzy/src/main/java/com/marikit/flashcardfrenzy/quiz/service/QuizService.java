package com.marikit.flashcardfrenzy.quiz.service;

import com.marikit.flashcardfrenzy.quiz.dto.QuizHistoryResponse;
import com.marikit.flashcardfrenzy.quiz.dto.QuizResultRequest;
import com.marikit.flashcardfrenzy.quiz.dto.QuizResultResponse;

import java.util.UUID;

public interface QuizService {

    QuizResultResponse submitResult(UUID userId, QuizResultRequest request);

    QuizHistoryResponse getHistory(UUID userId);
}
