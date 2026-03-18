package com.marikit.flashcardfrenzy.quiz.controller;

import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import com.marikit.flashcardfrenzy.common.SecurityUtil;
import com.marikit.flashcardfrenzy.quiz.dto.QuizHistoryResponse;
import com.marikit.flashcardfrenzy.quiz.dto.QuizResultRequest;
import com.marikit.flashcardfrenzy.quiz.dto.QuizResultResponse;
import com.marikit.flashcardfrenzy.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/results")
    public ResponseEntity<ApiResponse<QuizResultResponse>> submitResult(
            @Valid @RequestBody QuizResultRequest request) {

        User currentUser = SecurityUtil.getCurrentUser();
        QuizResultResponse response = quizService.submitResult(currentUser.getId(), request);
        return ResponseBuilder.created(response);
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<QuizHistoryResponse>> getHistory() {
        User currentUser = SecurityUtil.getCurrentUser();
        QuizHistoryResponse response = quizService.getHistory(currentUser.getId());
        return ResponseBuilder.success(response);
    }
}
