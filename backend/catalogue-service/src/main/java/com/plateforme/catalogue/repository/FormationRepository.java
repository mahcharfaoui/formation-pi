package com.plateforme.catalogue.repository;

import com.plateforme.catalogue.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByCategorieId(Long categorieId);

    List<Formation> findByActiveTrue();

    @Query("SELECT f FROM Formation f WHERE f.titre LIKE %:motCle% OR f.description LIKE %:motCle%")
    List<Formation> rechercheParMotCle(@Param("motCle") String motCle);

    @Query("SELECT f FROM Formation f WHERE f.niveau = :niveau")
    List<Formation> findByNiveau(@Param("niveau") String niveau);
}
