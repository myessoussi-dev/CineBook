package com.youssef.cinebook.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
    private LocalDateTime createdAt;
    // hibernate fait   reservation.setCreatedAt(LocalDateTime.now()); avant insert dans la BD
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
