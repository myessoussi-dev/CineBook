package com.youssef.cinebook.Mapper;

import com.youssef.cinebook.DTO.SeatDTO;
import com.youssef.cinebook.Entity.Seat;

public class SeatMapper {
    public static SeatDTO SeatToDTO(Seat seat){
        SeatDTO seatDTO=new SeatDTO();
        seatDTO.setColumn(seat.getColumnSeat());
        seatDTO.setRow(seat.getRowSeat());
        seatDTO.setId(seat.getId());

        return seatDTO;
    }
}
