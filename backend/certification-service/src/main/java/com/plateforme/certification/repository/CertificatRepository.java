package com.plateforme.certification.repository;

import com.plateforme.certification.model.Certificat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificatRepository extends JpaRepository<Certificat, Long> {
    List<Certificat> findByApprenantId(Long apprenantId);
    List<Certificat> findByFormationId(Long formationId);
    Optional<Certificat> findByNumeroCertificat(String numeroCertificat);

    @Query("SELECT c FROM Certificat c WHERE c.apprenantId = :apprenantId AND c.statut = 'ACTIF'")
    List<Certificat> findCertificatsActifs(@Param("apprenantId") Long apprenantId);
}
