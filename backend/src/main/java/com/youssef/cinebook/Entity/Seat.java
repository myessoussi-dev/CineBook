package com.youssef.cinebook.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Integer getColumnSeat() {
        return columnSeat;
    }

    public void setColumnSeat(Integer columnSeat) {
        this.columnSeat = columnSeat;
    }

    public Character getRowSeat() {
        return rowSeat;
    }

    public void setRowSeat(Character rowSeat) {
        this.rowSeat = rowSeat;
    }
}
