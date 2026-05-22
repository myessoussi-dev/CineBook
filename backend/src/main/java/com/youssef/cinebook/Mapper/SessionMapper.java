package com.youssef.cinebook.Mapper;

import com.youssef.cinebook.DTO.SessionDTO;
import com.youssef.cinebook.Entity.Session;

public class SessionMapper {
    public static SessionDTO SessionToDTO(Session session){
        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setId(session.getId());
        sessionDTO.setPrice(session.getPrice());
        sessionDTO.setRoom(session.getRoom());
        sessionDTO.setStartTime(session.getStartTime());
        return sessionDTO;
    }
}
