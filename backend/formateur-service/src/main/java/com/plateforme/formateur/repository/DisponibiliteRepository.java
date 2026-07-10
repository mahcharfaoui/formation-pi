package com.plateforme.formateur.repository;

import com.plateforme.formateur.model.Disponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {
    List<Disponibilite> findByFormateurId(Long formateurId);
    List<Disponibilite> findByFormateurIdAndDateDebutAfter(Long formateurId, LocalDateTime date);
}
