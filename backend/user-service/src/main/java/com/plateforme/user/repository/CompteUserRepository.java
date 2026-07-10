package com.plateforme.user.repository;

import com.plateforme.user.model.CompteUser;
import com.plateforme.user.model.StatutCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompteUserRepository extends JpaRepository<CompteUser, Long> {
    Optional<CompteUser> findByEmail(String email);
    List<CompteUser> findByStatut(StatutCompte statut);
    boolean existsByEmail(String email);
}
