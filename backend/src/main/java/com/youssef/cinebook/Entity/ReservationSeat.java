package com.youssef.cinebook.Entity;

import jakarta.persistence.*;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"seat_id", "session_id"})
})
public class ReservationSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Seat seat;

    @ManyToOne
    private Reservation reservation;

    @ManyToOne
    private Session session;
}
