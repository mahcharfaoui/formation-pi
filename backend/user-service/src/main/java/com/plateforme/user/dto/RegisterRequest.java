package com.plateforme.user.dto;

import com.plateforme.user.model.RoleCompte;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String email;
    private String motDePasse;
    private String nom;
    private String prenom;
    private RoleCompte role;
}
