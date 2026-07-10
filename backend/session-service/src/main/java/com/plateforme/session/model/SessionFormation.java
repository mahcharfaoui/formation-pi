package com.plateforme.session.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sessions_formation")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class SessionFormation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long formateurId; // ID du formateur

    @ElementCollection
    @CollectionTable(name = "session_formations_list", joinColumns = @JoinColumn(name = "session_id"))
    @Column(name = "formation_id")
    private List<Long> formationIds = new ArrayList<>();

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(nullable = false)
    private Integer capaciteMax;

    @Enumerated(EnumType.STRING)
    private StatutSession statut = StatutSession.A_PLANIFIER;

    @Column(nullable = false)
    private Integer participantsActuels = 0;

    private String lieu;

    private Boolean enLigne = false;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("session")
    private List<Inscription> inscriptions;
}
