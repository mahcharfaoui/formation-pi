package com.plateforme.certification.repository;

import com.plateforme.certification.model.ModeleDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ModeleDocumentRepository extends JpaRepository<ModeleDocument, Long> {
    List<ModeleDocument> findByType(String type);
    ModeleDocument findByNom(String nom);
}
