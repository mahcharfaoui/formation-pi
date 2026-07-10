package com.plateforme.user.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "apprenants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apprenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private String telephone;

    private LocalDate dateNaissance;

    private String adresse;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private StatutApprenant statut = StatutApprenant.ACTIF;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("apprenant")
    private List<Profil> profils;

    @OneToMany(mappedBy = "apprenant", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("apprenant")
    private List<Competence> competences;

    private LocalDate dateCreation;

    private LocalDate dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDate.now();
        dateModification = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDate.now();
    }
}
