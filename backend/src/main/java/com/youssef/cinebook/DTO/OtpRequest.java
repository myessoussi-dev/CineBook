package com.youssef.cinebook.DTO;

import lombok.Data;

@Data
public class OtpRequest {
    private String email;
    private String otpCode;
}
