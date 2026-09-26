package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.LoginRequest;
import com.youssef.cinebook.DTO.PendingUser;
import com.youssef.cinebook.DTO.RegisterRequest;
import com.youssef.cinebook.Entity.User;
import com.youssef.cinebook.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;


    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       OtpService otpService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
        this.otpService=otpService;
        this.emailService=emailService;
    }
    public User registerUser(PendingUser pendingUser){
        User user = new User();
        user.setEmail(pendingUser.getEmail());
        user.setFullName(pendingUser.getFullName());
        user.setPassword(pendingUser.getPassword());
        user.setRole(User.Role.USER);
        return userRepository.save(user);
    }
    public User loginUser(LoginRequest loginRequest){
        User user=userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()->
                new RuntimeException("user not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Wrong password");
        }
        return user;
    }

    public void registerRequest(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Account alredy exists !!");
        }
        PendingUser pendingUser= PendingUser.builder().
                fullName(registerRequest.getFullName()).
                email(registerRequest.getEmail()).
                password(passwordEncoder.encode(registerRequest.getPassword())).
                build();
        String otpCode=otpService.savePendingUser(pendingUser);
        emailService.sendOtpEmail(registerRequest.getEmail(),otpCode);
    }
}
