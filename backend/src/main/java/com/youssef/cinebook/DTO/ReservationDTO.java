package com.youssef.cinebook.DTO;

import lombok.Data;

import java.util.List;
@Data
public class ReservationDTO {
    private List<Long> seatIds;
    private Long sessionId;
    private Long userId;
}
