package com.youssef.cinebook.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "Room_id")
    private Room room;

    @Column(nullable = false)
    private Integer columnSeat;

    @Column(nullable = false,length = 1)
    private Character rowSeat;
}
