package com.youssef.cinebook.DTO;

import com.youssef.cinebook.Entity.Room;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SessionDTO {
    private Long id;
    private Room room;
    private LocalDateTime startTime;
    private BigDecimal price;

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

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
