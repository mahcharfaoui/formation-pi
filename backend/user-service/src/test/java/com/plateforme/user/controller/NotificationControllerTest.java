package com.plateforme.user.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.plateforme.user.model.Notification;
import com.plateforme.user.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationController notificationController;

    private Notification notification;

    @BeforeEach
    void setUp() {
        notification = Notification.builder()
                .id(1L)
                .message("Test notification")
                .lue(false)
                .build();
    }

    @Test
    void getAllNotificationsShouldReturnList() {
        when(notificationRepository.findAllByOrderByDateCreationDesc()).thenReturn(List.of(notification));

        ResponseEntity<List<Notification>> response = notificationController.getAllNotifications();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void getNonLuesShouldReturnList() {
        when(notificationRepository.findByLueFalseOrderByDateCreationDesc()).thenReturn(List.of(notification));

        ResponseEntity<List<Notification>> response = notificationController.getNonLues();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void countNonLuesShouldReturnCount() {
        when(notificationRepository.countByLueFalse()).thenReturn(5L);

        ResponseEntity<Long> response = notificationController.countNonLues();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(5L);
    }

    @Test
    void creerNotificationShouldReturnCreated() {
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        ResponseEntity<Notification> response = notificationController.creerNotification(notification);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    @Test
    void marquerCommeLueShouldReturnOk() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        ResponseEntity<Void> response = notificationController.marquerCommeLue(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(notification.isLue()).isTrue();
    }

    @Test
    void marquerCommeLueShouldThrowWhenNotFound() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> notificationController.marquerCommeLue(1L))
                .isInstanceOf(NoSuchElementException.class);
    }
}
