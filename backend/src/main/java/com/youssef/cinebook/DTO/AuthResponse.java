package com.youssef.cinebook.DTO;

import lombok.Data;

@Data
public class AuthResponse {

    private String token;
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}
