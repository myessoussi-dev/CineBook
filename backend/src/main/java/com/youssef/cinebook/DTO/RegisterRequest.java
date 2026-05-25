package com.youssef.cinebook.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email(message = "email is required")
    public String email;
    @NotBlank(message = "password is required")
    public String password;
    @NotBlank(message = "fullname is required")
    public String fullName;
}