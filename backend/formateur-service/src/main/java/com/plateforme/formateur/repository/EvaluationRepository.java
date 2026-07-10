package com.plateforme.formateur.repository;

import com.plateforme.formateur.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByFormateurId(Long formateurId);

    @Query("SELECT AVG(e.note) FROM Evaluation e WHERE e.formateur.id = :formateurId")
    Double calculerNoteMoyenne(@Param("formateurId") Long formateurId);
}
