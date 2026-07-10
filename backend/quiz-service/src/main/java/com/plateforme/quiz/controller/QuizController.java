package com.plateforme.quiz.controller;

import com.plateforme.quiz.model.*;
import com.plateforme.quiz.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@Tag(name = "Quiz", description = "API de gestion des quiz et évaluations")
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @Operation(summary = "Lister tous les quiz")
    public ResponseEntity<List<Quiz>> getAllQuiz() {
        return ResponseEntity.ok(quizService.getAllQuiz());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un quiz par ID")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un quiz")
    public ResponseEntity<Quiz> creerQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(quizService.creerQuiz(quiz));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un quiz")
    public ResponseEntity<Quiz> mettreAJourQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.mettreAJourQuiz(id, quiz));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerQuiz(@PathVariable Long id) {
        quizService.supprimerQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/chapitre/{chapitreId}")
    public ResponseEntity<List<Quiz>> getQuizParChapitre(@PathVariable Long chapitreId) {
        return ResponseEntity.ok(quizService.getQuizParChapitre(chapitreId));
    }

    // Endpoints pour les questions
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuestionsParQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getQuestionsParQuiz(quizId));
    }

    @PostMapping("/questions")
    public ResponseEntity<Question> ajouterQuestion(@RequestBody Question question) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(quizService.ajouterQuestion(question));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> mettreAJourQuestion(
            @PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(quizService.mettreAJourQuestion(id, question));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> supprimerQuestion(@PathVariable Long id) {
        quizService.supprimerQuestion(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoints pour les tentatives
    @PostMapping("/{quizId}/tentatives/apprenant/{apprenantId}")
    public ResponseEntity<Tentative> demarrerTentative(
            @PathVariable Long quizId, @PathVariable Long apprenantId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(quizService.demarrerTentative(quizId, apprenantId));
    }

    @PutMapping("/tentatives/{tentativeId}/soumettre")
    public ResponseEntity<Tentative> soumettreTentative(
            @PathVariable Long tentativeId, @RequestParam Integer score) {
        return ResponseEntity.ok(quizService.soumettreTentative(tentativeId, score));
    }

    @GetMapping("/apprenant/{apprenantId}/tentatives")
    public ResponseEntity<List<Tentative>> getTentativesApprenant(
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(quizService.getTentativesApprenant(apprenantId));
    }

    @GetMapping("/{quizId}/apprenant/{apprenantId}/derniere-tentative")
    @Operation(summary = "Obtenir la dernière tentative d'un apprenant pour un quiz")
    public ResponseEntity<Tentative> getDerniereTentative(
            @PathVariable Long quizId, @PathVariable Long apprenantId) {
        return ResponseEntity.ok(quizService.getDerniereTentative(apprenantId, quizId));
    }
}
