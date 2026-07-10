package com.plateforme.certification;

import com.plateforme.certification.model.Certificat;
import com.plateforme.certification.repository.CertificatRepository;
import com.plateforme.certification.service.CertificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificationServiceTest {

    @Mock
    private CertificatRepository certificatRepository;

    @InjectMocks
    private CertificationService certificationService;

    @Test
    void testGetCertificatsApprenant() {
        Certificat c1 = Certificat.builder().id(1L).apprenantId(1L).build();
        Certificat c2 = Certificat.builder().id(2L).apprenantId(1L).build();
        when(certificatRepository.findByApprenantId(1L)).thenReturn(Arrays.asList(c1, c2));

        List<Certificat> certificats = certificationService.getCertificatsApprenant(1L);

        assertEquals(2, certificats.size());
    }

    @Test
    void testGenererCertificat() {
        Certificat c = Certificat.builder()
                .apprenantId(1L)
                .formationId(1L)
                .scoreObtenu(85.0)
                .build();
        when(certificatRepository.save(any(Certificat.class))).thenReturn(c);

        Certificat result = certificationService.genererCertificat(c);

        assertNotNull(result);
        assertNotNull(result.getNumeroCertificat());
        assertTrue(result.getNumeroCertificat().startsWith("CERT-"));
    }

    @Test
    void testVerifierValiditeCertificat() {
        Certificat c = Certificat.builder()
                .numeroCertificat("CERT-TEST1234")
                .valide(true)
                .dateExpiration(LocalDate.now().plusYears(1))
                .statut(com.plateforme.certification.model.StatutCertificat.ACTIF)
                .build();
        when(certificatRepository.findByNumeroCertificat("CERT-TEST1234")).thenReturn(Optional.of(c));

        Boolean result = certificationService.verifierValiditeCertificat("CERT-TEST1234");

        assertTrue(result);
    }
}
