package com.plateforme.user.repository;

import com.plateforme.user.model.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    Optional<Apprenant> findByEmail(String email);
    List<Apprenant> findByStatut(String statut);

    @Query("SELECT a FROM Apprenant a WHERE a.nom LIKE %:motCle% OR a.prenom LIKE %:motCle% OR a.email LIKE %:motCle%")
    List<Apprenant> rechercheParMotCle(@Param("motCle") String motCle);
}
