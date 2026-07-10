package com.plateforme.formateur.repository;

import com.plateforme.formateur.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {
    Optional<Formateur> findByEmail(String email);
    List<Formateur> findByActifTrue();

    @Query("SELECT f FROM Formateur f WHERE f.nom LIKE %:motCle% OR f.prenom LIKE %:motCle%")
    List<Formateur> rechercheParMotCle(@Param("motCle") String motCle);
}
