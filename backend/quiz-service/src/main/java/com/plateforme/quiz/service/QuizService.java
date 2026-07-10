package com.plateforme.quiz.service;

import com.plateforme.quiz.model.*;
import com.plateforme.quiz.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final TentativeRepository tentativeRepository;

    public List<Quiz> getAllQuiz() {
        return quizRepository.findByActifTrue();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz non trouvé avec l'id: " + id));
    }

    public Quiz creerQuiz(Quiz quiz) {
        if (quiz.getFormationId() == null) {
            throw new RuntimeException("La formation est obligatoire pour créer un quiz");
        }
        if (quiz.getChapitreId() == null) {
            throw new RuntimeException("Le chapitre (cours) est obligatoire pour créer un quiz");
        }
        return quizRepository.save(quiz);
    }

    public Quiz mettreAJourQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = getQuizById(id);
        quiz.setTitre(quizDetails.getTitre());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setDureeMinutes(quizDetails.getDureeMinutes());
        quiz.setScoreMinimum(quizDetails.getScoreMinimum());
        return quizRepository.save(quiz);
    }

    public void supprimerQuiz(Long id) {
        Quiz quiz = getQuizById(id);
        quiz.setActif(false);
        quizRepository.save(quiz);
    }

    public List<Quiz> getQuizParChapitre(Long chapitreId) {
        return quizRepository.findByChapitreId(chapitreId);
    }

    // Gestion des questions
    public List<Question> getQuestionsParQuiz(Long quizId) {
        return questionRepository.findByQuiz_Id(quizId);
    }

    public Question ajouterQuestion(Question question) {
        if (question.getQuiz() == null && question.getQuizId() != null) {
            Quiz quiz = quizRepository.findById(question.getQuizId())
                    .orElseThrow(() -> new RuntimeException("Quiz non trouvé: " + question.getQuizId()));
            question.setQuiz(quiz);
        }
        return questionRepository.save(question);
    }

    public Question mettreAJourQuestion(Long id, Question questionDetails) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question non trouvée avec l'id: " + id));
        question.setEnonce(questionDetails.getEnonce());
        question.setType(questionDetails.getType());
        question.setPoints(questionDetails.getPoints());
        question.setReponseCorrecte(questionDetails.getReponseCorrecte());
        question.setChoixProposes(questionDetails.getChoixProposes());
        if (questionDetails.getQuizId() != null) {
            Quiz quiz = quizRepository.findById(questionDetails.getQuizId())
                    .orElseThrow(() -> new RuntimeException("Quiz non trouvé: " + questionDetails.getQuizId()));
            question.setQuiz(quiz);
        }
        return questionRepository.save(question);
    }

    public void supprimerQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    // Gestion des tentatives
    public Tentative demarrerTentative(Long quizId, Long apprenantId) {
        Quiz quiz = getQuizById(quizId);

        Tentative tentative = Tentative.builder()
                .apprenantId(apprenantId)
                .quiz(quiz)
                .scoreMax(quiz.getQuestions().stream()
                        .mapToInt(Question::getPoints)
                        .sum())
                .build();

        return tentativeRepository.save(tentative);
    }

    public Tentative soumettreTentative(Long tentativeId, Integer score) {
        Tentative tentative = tentativeRepository.findById(tentativeId)
                .orElseThrow(() -> new RuntimeException("Tentative non trouvée avec l'id: " + tentativeId));

        tentative.setScore(score);
        tentative.setDateFin(LocalDateTime.now());
        tentative.setReussi(score >= tentative.getQuiz().getScoreMinimum());

        return tentativeRepository.save(tentative);
    }

    public List<Tentative> getTentativesApprenant(Long apprenantId) {
        return tentativeRepository.findByApprenantId(apprenantId);
    }

    public Tentative getDerniereTentative(Long apprenantId, Long quizId) {
        return tentativeRepository.findDerniereTentative(apprenantId, quizId);
    }
}
