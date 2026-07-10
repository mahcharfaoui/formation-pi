package com.plateforme.user.dto;

import com.plateforme.user.model.RoleCompte;
import com.plateforme.user.model.StatutCompte;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private RoleCompte role;
    private StatutCompte statut;
    private String token;
}
