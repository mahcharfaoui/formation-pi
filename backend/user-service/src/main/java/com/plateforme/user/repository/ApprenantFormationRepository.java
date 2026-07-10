package com.plateforme.user.repository;

import com.plateforme.user.model.ApprenantFormation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApprenantFormationRepository extends JpaRepository<ApprenantFormation, Long> {
    List<ApprenantFormation> findByApprenantId(Long apprenantId);
    void deleteByApprenantId(Long apprenantId);
    boolean existsByApprenantIdAndFormationId(Long apprenantId, Long formationId);
}
