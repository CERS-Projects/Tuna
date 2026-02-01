package com.example.backend.auth.service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.example.backend.auth.dto.OtpRequest;
import com.example.backend.exception.AuthException;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OtpServiceImpl implements OtpService {

    private final StringRedisTemplate stringRedisTemplate;
    private final HashService hashService;
    private final LoginAttemptService loginAttemptService;

    @Override
    public String createOtp(Integer userId) {
        String otp;
        String hashOtp;
        String optKey = userId + "_Otp";

        Random random = new Random();
        int min = 100000;
        int max = 999999;
        otp = String.valueOf(random.nextInt(max - min + 1) + min);
        hashOtp = hashService.toHash(otp);
        stringRedisTemplate.opsForValue().set(optKey, hashOtp, 5, TimeUnit.MINUTES);
        return otp;
    }

    @Override
    public Integer confirmOtp(OtpRequest otpRequest) {
        Integer userId = otpRequest.getUserId();
        String otpKey = userId + "_Otp";
        String saveHashOtp = stringRedisTemplate.opsForValue().get(otpKey);
        String hashOtp = hashService.toHash(otpRequest.getOtp());

        if (saveHashOtp == null) {
            throw new AuthException("ログインしなおしてください");
        }

        if (!hashOtp.equals(saveHashOtp)) {
            loginAttemptService.otpFailed(userId);
            throw new AuthException("ワンタイムパスワードが異なります");
        }
        String missOtpKey = userId + "_MissOtp";
        stringRedisTemplate.delete(otpKey);
        if (stringRedisTemplate.hasKey(missOtpKey)) {
            stringRedisTemplate.delete(missOtpKey);
        }
        return userId;
    }

}
