package com.youssef.cinebook.Controller;

import com.youssef.cinebook.DTO.*;
import com.youssef.cinebook.Entity.User;
import com.youssef.cinebook.Security.CustomUserDetails;
import com.youssef.cinebook.Service.AuthService;
import com.youssef.cinebook.Service.EmailService;
import com.youssef.cinebook.Service.JwtService;
import com.youssef.cinebook.Service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthController(AuthService authService,JwtService jwtService,
                          EmailService emailService,
                          OtpService otpService) {
        this.authService = authService;
        this.jwtService=jwtService;
        this.emailService=emailService;
        this.otpService=otpService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        try{
        User response =authService.loginUser(loginRequest);
        return ResponseEntity.ok(generateResponse(response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }
    private AuthResponse generateResponse(User user){
        String token =jwtService.generateToken(new CustomUserDetails(user));
        UserResponse userResponse= new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullName());
        return new AuthResponse(token,userResponse);
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest otpRequest){
        PendingUser pendingUser=otpService.getPendingUser(otpRequest.getEmail());
        boolean isValid = otpService.validateOtp(otpRequest.getEmail(),
                otpRequest.getOtpCode());
        if(pendingUser==null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).
                    body(Map.of("Error","SESSION_EXPIRED","message",
                            "\"The registration session has expired. Please fill out the form again.\""));
        }
        if (!isValid){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","INVALID_OTP"));
        }
        otpService.clearRedisKeys(otpRequest.getEmail());
        return ResponseEntity.ok(generateResponse(authService.registerUser(pendingUser)));
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest){
        try {
            authService.registerRequest(registerRequest);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody OtpRequest otpRequest){
        if (otpService.isCoolDownActive(otpRequest.getEmail())){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("message","too many request"));
        }
        String newOtp=otpService.regenerateOtpCode(otpRequest.getEmail());
        if (newOtp==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","SESSION_EXPIRED"));
        }
        emailService.sendOtpEmail(otpRequest.getEmail(), newOtp);
        return ResponseEntity.ok(Map.of(
                "message", "New code otp was sent !.",
                "cooldownSeconds", 30
        ));

    }
}
