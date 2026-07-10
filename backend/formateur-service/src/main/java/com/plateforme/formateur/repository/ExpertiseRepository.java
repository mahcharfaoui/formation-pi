package com.plateforme.formateur.repository;

import com.plateforme.formateur.model.Expertise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpertiseRepository extends JpaRepository<Expertise, Long> {
    List<Expertise> findByFormateurId(Long formateurId);
    List<Expertise> findByDomaine(String domaine);
}
