package com.plateforme.user.controller;

import com.plateforme.user.model.Notification;
import com.plateforme.user.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findAllByOrderByDateCreationDesc());
    }

    @GetMapping("/non-lues")
    public ResponseEntity<List<Notification>> getNonLues() {
        return ResponseEntity.ok(notificationRepository.findByLueFalseOrderByDateCreationDesc());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countNonLues() {
        return ResponseEntity.ok(notificationRepository.countByLueFalse());
    }

    @PostMapping
    public ResponseEntity<Notification> creerNotification(@RequestBody Notification notification) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationRepository.save(notification));
    }

    @PutMapping("/{id}/lu")
    public ResponseEntity<Void> marquerCommeLue(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setLue(true);
        notificationRepository.save(n);
        return ResponseEntity.ok().build();
    }
}
