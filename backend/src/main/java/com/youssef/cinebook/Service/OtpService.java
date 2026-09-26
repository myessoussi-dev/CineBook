package com.youssef.cinebook.Service;

import com.youssef.cinebook.DTO.PendingUser;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.security.SecureRandom;
import java.time.Duration;
@Service
public class OtpService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public OtpService(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }
    public boolean isCoolDownActive(String email){
        String key="otp_cooldown:"+email.toLowerCase().trim();
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
    public String generateOtpCode(String email){
        SecureRandom random=new SecureRandom();
        String otpCode=String.valueOf(100000+random.nextInt(900000));
        String otpKey="otp:" + email;
        redisTemplate.opsForValue().set(otpKey,otpCode,Duration.ofMinutes(5));
        String cooldownKey = "otp_cooldown:" + email;

        redisTemplate.opsForValue().set(cooldownKey, "true", Duration.ofSeconds(30));
        return otpCode;
    }
    public String savePendingUser(PendingUser pendingUser){
        String email=pendingUser.getEmail().trim();
        String userJson=objectMapper.writeValueAsString(pendingUser);
        String userKey="pending_user:" + email;
        redisTemplate.opsForValue().set(userKey,userJson, Duration.ofMinutes(15));
        return generateOtpCode(pendingUser.getEmail());
    }
    public String regenerateOtpCode(String email){
        String userKey="pending_user:"+email;
        Boolean userExists=redisTemplate.hasKey(userKey);
        if(Boolean.FALSE.equals(userExists)){
            return null;
        }
        return generateOtpCode(email);
    }
    public boolean validateOtp(String email, String submittedCode) {
        String cleanEmail = email.toLowerCase().trim();
        String otpKey = "otp:" + cleanEmail;
        String storedOtp = redisTemplate.opsForValue().get(otpKey);

        if (storedOtp == null) {
            return false;
        }
        return storedOtp.equals(submittedCode);
    }
    public PendingUser getPendingUser(String email){
        String userKey="pending_user:"+email;
        String userJson=redisTemplate.opsForValue().get(userKey);
        if(userJson == null){
            return null;
        }
        return objectMapper.readValue(userJson, PendingUser.class);
    }
    public void clearRedisKeys(String email) {
        redisTemplate.delete("otp:" + email);
        redisTemplate.delete("pending_user:" + email);
        redisTemplate.delete("otp_cooldown:" + email);
    }


}
