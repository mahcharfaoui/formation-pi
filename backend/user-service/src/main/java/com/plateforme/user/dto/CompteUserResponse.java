package com.plateforme.user.dto;

import com.plateforme.user.model.RoleCompte;
import com.plateforme.user.model.StatutCompte;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteUserResponse {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private RoleCompte role;
    private StatutCompte statut;
    private LocalDateTime dateCreation;
}
