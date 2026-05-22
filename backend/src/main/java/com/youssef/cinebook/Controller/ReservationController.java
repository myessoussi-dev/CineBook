package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.ReservationDTO;
import com.youssef.cinebook.Entity.Reservation;
import com.youssef.cinebook.Service.ReservationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    @PostMapping
    public void addReservation(@RequestBody ReservationDTO reservationDTO){
        reservationService.addReservation(reservationDTO);
    }
}
