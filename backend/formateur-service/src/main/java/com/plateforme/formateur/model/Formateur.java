package com.plateforme.formateur.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "formateurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formateur {

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

    private String photoUrl;

    @Column(length = 5000)
    private String cv;

    @Column(nullable = false)
    private Boolean actif = true;

    private Double tarifHoraire;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("formateur")
    private List<Expertise> expertises;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("formateur")
    private List<Disponibilite> disponibilites;

    @OneToMany(mappedBy = "formateur", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("formateur")
    private List<Evaluation> evaluations;
}
