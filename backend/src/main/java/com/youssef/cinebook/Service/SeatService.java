package com.youssef.cinebook.Service;

import com.youssef.cinebook.Entity.Room;
import com.youssef.cinebook.Entity.Seat;
import com.youssef.cinebook.Repository.RoomRepository;
import com.youssef.cinebook.Repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService {
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;

    public SeatService(SeatRepository seatRepository, RoomRepository roomRepository) {
        this.seatRepository = seatRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public void fullSeatTable(List<Long> roomids) {
        List<Character> characterList =
                new ArrayList<>(List.of('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'));
        List<Seat> seats = new ArrayList<>();
        for (Long roomId : roomids) {
            Room room = roomRepository.findById(roomId).orElseThrow(
                    () -> new RuntimeException("room not found!"));

            for (Character c : characterList) {
                for (int i = 1; i <= 20; i++) {
                    Seat seat = new Seat();
                    seat.setRowSeat(c);
                    seat.setColumnSeat(i);
                    seat.setRoom(room);
                    seats.add(seat);
                }
            }
        }
        seatRepository.saveAll(seats);
    }
}