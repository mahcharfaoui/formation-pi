package com.plateforme.quiz.repository;

import com.plateforme.quiz.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByChapitreId(Long chapitreId);
    List<Quiz> findByActifTrue();
}
