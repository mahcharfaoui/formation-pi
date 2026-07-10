package com.plateforme.session.repository;

import com.plateforme.session.model.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findBySessionId(Long sessionId);
    List<Inscription> findByApprenantId(Long apprenantId);
    List<Inscription> findByApprenantIdAndStatut(Long apprenantId, String statut);
    Boolean existsByApprenantIdAndSessionId(Long apprenantId, Long sessionId);
    void deleteBySessionId(Long sessionId);
}
