package com.plateforme.quiz;

import com.plateforme.quiz.model.Quiz;
import com.plateforme.quiz.repository.QuizRepository;
import com.plateforme.quiz.service.QuizService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizService quizService;

    @Test
    void testGetAllQuiz() {
        Quiz q1 = Quiz.builder().id(1L).titre("Quiz Java").build();
        Quiz q2 = Quiz.builder().id(2L).titre("Quiz Spring").build();
        when(quizRepository.findByActifTrue()).thenReturn(Arrays.asList(q1, q2));

        List<Quiz> quiz = quizService.getAllQuiz();

        assertEquals(2, quiz.size());
    }

    @Test
    void testCreerQuiz() {
        Quiz q = Quiz.builder().titre("Nouveau Quiz").scoreMinimum(70).build();
        when(quizRepository.save(any(Quiz.class))).thenReturn(q);

        Quiz result = quizService.creerQuiz(q);

        assertNotNull(result);
        assertEquals("Nouveau Quiz", result.getTitre());
    }
}
