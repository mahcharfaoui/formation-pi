package com.plateforme.suivi.repository;

import com.plateforme.suivi.model.Progression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressionRepository extends JpaRepository<Progression, Long> {
    List<Progression> findByApprenantId(Long apprenantId);
    List<Progression> findByApprenantIdAndFormationId(Long apprenantId, Long formationId);
    Progression findByApprenantIdAndChapitreId(Long apprenantId, Long chapitreId);

    @Query("SELECT AVG(p.pourcentage) FROM Progression p WHERE p.apprenantId = :apprenantId AND p.formationId = :formationId")
    Double calculerProgressionGlobale(@Param("apprenantId") Long apprenantId, @Param("formationId") Long formationId);
}
