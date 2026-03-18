package com.marikit.flashcardfrenzy.quiz.repository;

import com.marikit.flashcardfrenzy.quiz.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, UUID> {

    List<QuizResult> findByUserId(UUID userId);

    long countByUserId(UUID userId);
}
