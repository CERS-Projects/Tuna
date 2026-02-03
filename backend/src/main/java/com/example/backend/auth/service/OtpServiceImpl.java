package com.example.backend.auth.service;

import java.security.SecureRandom;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.auth.dto.OtpRequest;
import com.example.backend.auth.dto.OtpResponse;
import com.example.backend.auth.dto.RedisOtp;
import com.example.backend.exception.AuthException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OtpServiceImpl implements OtpService {

    private final StringRedisTemplate stringRedisTemplate;
    private final LoginAttemptService loginAttemptService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom;
    private final ObjectMapper objectMapper;

    @Override
    public OtpResponse createOtp(Integer userId) {

        String otp;
        String hashOtp;
        String jsonValue;

        if (stringRedisTemplate.hasKey(userId + "_OtpToken")) {
            String oldOtpToken = stringRedisTemplate.opsForValue().get(userId + "_OtpToken");
            stringRedisTemplate.delete(userId + "_OtpToken");
            stringRedisTemplate.delete(oldOtpToken);
        }

        int min = 100000;
        int max = 999999;
        otp = String.valueOf(secureRandom.nextInt(max - min + 1) + min);
        hashOtp = passwordEncoder.encode(otp);
        RedisOtp redisOtp = new RedisOtp(userId, hashOtp);
        String otpTokenKey = UUID.randomUUID().toString();
        if (hashOtp == null) {
            throw new IllegalStateException("サーバー内部でエラーが発生しました");
        }

        try {
            jsonValue = objectMapper.writeValueAsString(redisOtp);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("サーバー内部でエラーが発生しました");
        }
        if (otpTokenKey == null || jsonValue == null) {
            throw new IllegalStateException("サーバー内部でエラーが発生しました");
        }
        stringRedisTemplate.opsForValue().set(userId + "_OtpToken", otpTokenKey);
        stringRedisTemplate.opsForValue().set(otpTokenKey, jsonValue, 5, TimeUnit.MINUTES);
        OtpResponse otpResponse = new OtpResponse(otpTokenKey, otp);
        return otpResponse;
    }

    @Override
    public Integer confirmOtp(OtpRequest otpRequest) {
        String requestOtp = otpRequest.getOtp();
        String otpToken = otpRequest.getOtpToken();
        if (requestOtp == null || otpToken == null) {
            throw new IllegalArgumentException("リクエストの値にnullが含まれています");
        }
        RedisOtp redisOtp;
        if (!stringRedisTemplate.hasKey(otpToken)) {
            throw new AuthException("ログインしなおしてください");
        }
        String jsonValue = stringRedisTemplate.opsForValue().get(otpToken);
        try {
            redisOtp = objectMapper.readValue(jsonValue, RedisOtp.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("サーバー内部でエラーが発生しました");
        }

        if (redisOtp == null) {
            throw new AuthException("ログインしなおしてください");
        }

        if (!passwordEncoder.matches(requestOtp, redisOtp.getOtp())) {
            loginAttemptService.otpFailed(redisOtp.getUserId(), otpToken);
            throw new AuthException("ワンタイムパスワードが異なります");
        }
        String missOtpKey = redisOtp.getUserId() + "_MissOtp";
        stringRedisTemplate.delete(redisOtp.getUserId() + "_OtpToken");
        stringRedisTemplate.delete(otpToken);
        if (stringRedisTemplate.hasKey(missOtpKey)) {
            stringRedisTemplate.delete(missOtpKey);
        }
        return redisOtp.getUserId();
    }

}
