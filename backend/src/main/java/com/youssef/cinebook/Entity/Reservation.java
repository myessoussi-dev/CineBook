package com.youssef.cinebook.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User user;
    @ManyToOne
    @JoinColumn(name = "session_id")
    private Session session;
    private LocalDateTime createdAt;

    @Column(nullable = true ,precision = 10, scale = 2)
    private BigDecimal price;
    // hibernate fait   reservation.setCreatedAt(LocalDateTime.now()); avant insert dans la BD
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
