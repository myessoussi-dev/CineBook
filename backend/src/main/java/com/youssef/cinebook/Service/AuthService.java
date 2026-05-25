package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.LoginRequest;
import com.youssef.cinebook.DTO.RegisterRequest;
import com.youssef.cinebook.Entity.User;
import com.youssef.cinebook.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
    }
    public void registerUser(RegisterRequest registerRequest){
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.USER);
        userRepository.save(user);
    }
    public User loginUser(LoginRequest loginRequest){
        User user=userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()->
                new RuntimeException("user not found"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Wrong password");

        }
        return user;
    }

}
