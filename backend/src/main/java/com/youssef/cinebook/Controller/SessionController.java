package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.SeatDTO;
import com.youssef.cinebook.Entity.Seat;
import com.youssef.cinebook.Entity.Session;
import com.youssef.cinebook.Service.SessionService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {
    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/{id}")
    public Session getSessionDetails(@PathVariable Long id){
        return sessionService.getSessionDetails(id);

    }
    @GetMapping("/{id}/seats")
    public List<SeatDTO> getRoomSeat(@PathVariable Long id){
        return sessionService.getRoomSeats(id);
    }
    @GetMapping("/{id}/reserved-seats")
    public List<SeatDTO> getReservedSeats(@PathVariable Long id){
        return sessionService.getReservedSeats(id);
    }
    @GetMapping("/movies")
    public List<Session> getAvailableSessions(){
        return sessionService.getAvailableSessions();
    }
}
