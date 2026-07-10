package com.plateforme.catalogue.repository;

import com.plateforme.catalogue.model.Chapitre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChapitreRepository extends JpaRepository<Chapitre, Long> {
    List<Chapitre> findByFormationIdOrderByOrdreAsc(Long formationId);
}
