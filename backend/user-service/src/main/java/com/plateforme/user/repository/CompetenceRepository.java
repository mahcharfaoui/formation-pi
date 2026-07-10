package com.plateforme.user.repository;

import com.plateforme.user.model.Competence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    List<Competence> findByApprenantId(Long apprenantId);
    List<Competence> findByNom(String nom);
}
