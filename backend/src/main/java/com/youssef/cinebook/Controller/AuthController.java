package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.AuthResponse;
import com.youssef.cinebook.DTO.LoginRequest;
import com.youssef.cinebook.DTO.RegisterRequest;
import com.youssef.cinebook.DTO.UserResponse;
import com.youssef.cinebook.Entity.User;
import com.youssef.cinebook.Security.CustomUserDetails;
import com.youssef.cinebook.Service.AuthService;
import com.youssef.cinebook.Service.EmailService;
import com.youssef.cinebook.Service.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthController(AuthService authService,JwtService jwtService,
                          EmailService emailService) {
        this.authService = authService;
        this.jwtService=jwtService;
        this.emailService=emailService;
    }
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest){
        User user =authService.loginUser(loginRequest);
        String token =jwtService.generateToken(new CustomUserDetails(user));
        UserResponse userResponse= new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullname(user.getFullName());

        return new AuthResponse(token,userResponse);
    }
    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest){
        authService.registerUser(registerRequest);

    }
}
