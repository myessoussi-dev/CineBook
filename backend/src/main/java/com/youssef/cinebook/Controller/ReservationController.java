package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.ReservationDTO;
import com.youssef.cinebook.Entity.Reservation;
import com.youssef.cinebook.Service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }
    @PostMapping
    public ResponseEntity<?> addReservation(@RequestBody ReservationDTO reservationDTO){
        try {
            Long id =reservationService.addReservation(reservationDTO);
            return ResponseEntity.ok(Map.of("message","Réservation crée !","id",id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                    body(Map.of("message","Erreur lors de la reservation !"));
        }
    }
}
