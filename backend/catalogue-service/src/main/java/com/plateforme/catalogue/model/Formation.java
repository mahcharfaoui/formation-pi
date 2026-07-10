package com.plateforme.catalogue.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "formations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"chapitres"})
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double tarif;

    @Column(nullable = false)
    private Integer dureeHeures;

    @Enumerated(EnumType.STRING)
    private Niveau niveau;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    private List<Chapitre> chapitres;

    private String imageUrl;

    @Column(name = "competences_requises")
    private String competencesRequises;
}
