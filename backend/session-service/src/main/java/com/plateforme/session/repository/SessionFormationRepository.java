package com.plateforme.session.repository;

import com.plateforme.session.model.SessionFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessionFormationRepository extends JpaRepository<SessionFormation, Long> {
    List<SessionFormation> findByFormationIdsContaining(Long formationId);
    List<SessionFormation> findByFormateurId(Long formateurId);
    List<SessionFormation> findByDateDebutAfter(LocalDate date);
    List<SessionFormation> findByStatut(String statut);
}
