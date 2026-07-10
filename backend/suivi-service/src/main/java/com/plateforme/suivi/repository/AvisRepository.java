package com.plateforme.suivi.repository;

import com.plateforme.suivi.model.Avis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvisRepository extends JpaRepository<Avis, Long> {
    List<Avis> findByApprenantId(Long apprenantId);
    List<Avis> findByFormationId(Long formationId);

    @Query("SELECT AVG(a.note) FROM Avis a WHERE a.formationId = :formationId")
    Double calculerNoteMoyenne(@Param("formationId") Long formationId);
}
