package com.plateforme.quiz.repository;

import com.plateforme.quiz.model.Tentative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TentativeRepository extends JpaRepository<Tentative, Long> {
    List<Tentative> findByApprenantId(Long apprenantId);
    List<Tentative> findByQuizId(Long quizId);

    @Query("SELECT t FROM Tentative t WHERE t.apprenantId = :apprenantId AND t.quiz.id = :quizId ORDER BY t.dateFin DESC LIMIT 1")
    Tentative findDerniereTentative(@Param("apprenantId") Long apprenantId, @Param("quizId") Long quizId);
}
