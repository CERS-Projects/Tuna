package com.example.backend.auth.service;

import java.time.Instant;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.exception.AuthException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class LoginAttemptServiceImpl implements LoginAttemptService {

    private final UserRepository userRepository;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public void isStop(HttpServletRequest request, String userId) {
        try {

            UserEntity userEntity = userRepository.findById(Integer.parseInt(userId))
                    .orElseThrow(() -> {
                        request.setAttribute("ERROR_MESSAGE", "ユーザーIDまたはパスワードが異なります");
                        return new BadCredentialsException("");
                    });
            if (userEntity.getAccountsStopFlag().equals(true)) {
                request.setAttribute("ERROR_MESSAGE", "アカウント停止中");
                throw new AccessDeniedException("");
            }
        } catch (NumberFormatException e) {
            throw new IllegalStateException("サーバー内部でエラーが発生しました");
        }
    }

    @Override
    public void loginFailed(String showUserId) {
        String missCountKey = showUserId + "MissCount";
        String lockUserKey = showUserId + "LockUser";
        Integer missCount = 0;

        // 初めてパスワードを間違えた時の処理
        if (stringRedisTemplate.hasKey(missCountKey) == false) {
            stringRedisTemplate.opsForValue().set(missCountKey, "1", 10, TimeUnit.MINUTES);
            return;
        } else {
            missCount = Integer.valueOf(stringRedisTemplate.opsForValue().get(missCountKey));
            if (missCount == null) {
                throw new IllegalStateException("サーバー内部でエラーが発生しました");
            }
            missCount++;
            stringRedisTemplate.opsForValue().set(missCountKey, Objects.requireNonNull(missCount.toString()), 10,
                    TimeUnit.MINUTES);
        }

        // 間違えた回数が3回になったとき
        if (missCount == 3) {
            Instant userLockTime = Instant.now();
            stringRedisTemplate.opsForValue().set(lockUserKey, Objects.requireNonNull(userLockTime.toString()));
            stringRedisTemplate.opsForValue().getAndExpire(lockUserKey, 10, TimeUnit.MINUTES);
            throw new AccessDeniedException("一定回数パスワードを間違えたため、アカウントをロックしています。10分後お試しください");
        }

    }

    @Override
    public void otpFailed(Integer userId, String otpToken) {
        if (otpToken == null) {
            throw new IllegalArgumentException("サーバー内部でエラーが発生しました");
        }
        String missOtpKey = userId + "_MissOtp";
        Integer missCount;
        if (!stringRedisTemplate.hasKey(missOtpKey)) {
            stringRedisTemplate.opsForValue().set(missOtpKey, "1", 5, TimeUnit.MINUTES);
            return;
        } else {
            missCount = Integer.valueOf(stringRedisTemplate.opsForValue().get(missOtpKey));
            if (missCount == null) {
                throw new IllegalStateException("サーバー内部でエラーが発生しました");
            }
            missCount++;
            stringRedisTemplate.opsForValue().set(missOtpKey, String.valueOf(missCount), 5, TimeUnit.MINUTES);
        }

        if (missCount == 3) {
            stringRedisTemplate.delete(otpToken);
            stringRedisTemplate.delete(missOtpKey);
            throw new AuthException("ワンタイムパスワードの試行回数に到達したため、ログインをしなおしてください");
        }
    }

}
