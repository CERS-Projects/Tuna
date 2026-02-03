package com.example.backend.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.OtpResponse;
import com.example.backend.auth.repository.RefreshTokenRepository;
import com.example.backend.exception.AuthException;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Log4j2
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final LoginAttemptService loginAttemptService;
    private final StringRedisTemplate stringRedisTemplate;
    private final OtpService otpService;
    private final MailService mailService;

    @Override
    public String login(LoginSelectRequest loginSelectRequest) {
        String lockUserKey = loginSelectRequest.getShowUserId() + "LockUser";
        String missCountUserKey = loginSelectRequest.getShowUserId() + "MissCount";

        if (loginSelectRequest.getShowUserId() == null || loginSelectRequest.getPassword() == null) {
            throw new IllegalArgumentException("ログインIDまたはパスワード、両方がnullです");
        }

        if (userRepository.existsByShowUserId(loginSelectRequest.getShowUserId()) == false) {
            throw new AuthException("ログインIDまたはパスワードが異なります");
        }

        // 未検証のIDとパスワードを格納
        try {
            Authentication token = new UsernamePasswordAuthenticationToken(loginSelectRequest.getShowUserId(),
                    loginSelectRequest.getPassword());

            if (stringRedisTemplate.hasKey(lockUserKey)) {
                throw new AccessDeniedException("一定回数パスワードを間違えたため、アカウントをロックしています。10分後お試しください");
            }

            // 検証後成功して権限も付与したやつを格納
            Authentication authentication = authenticationManager.authenticate(token);

            if (stringRedisTemplate.hasKey(missCountUserKey)) {
                stringRedisTemplate.delete(missCountUserKey);
            }

            // springに知らせるためのを作成
            SecurityContext context = SecurityContextHolder.getContext();

            // springに知らせることでこのリクエストではどこからでも認証・認可確認可能
            context.setAuthentication(authentication);

            // トークン生成
            UserEntity userEntity = userRepository.findByShowUserId(authentication.getName())
                    .orElseThrow(() -> new AuthException("ユーザーIDまたはパスワードが異なります"));

            // ワンタイムパスワード生成
            OtpResponse otpResponse = otpService.createOtp(userEntity.getUserId());

            // ワンタイムパスワードを送信
            mailService.sendMail(userEntity, otpResponse.getOtp());

            return otpResponse.getOtpTokenKey();
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(loginSelectRequest.getShowUserId());
            throw new AuthException("ログインIDまたはパスワードが異なります");
        }
    }

    @Override
    public List<GrantedAuthority> giveAuthority(@NonNull UserEntity userEntity) {
        List<GrantedAuthority> authority = new ArrayList<>();
        Integer userId = userEntity.getUserId();
        if (userId == null) {
            throw new IllegalArgumentException("値がnullです");
        }
        if (teacherRepository.existsByUserId(userEntity.getUserId()).equals(false)) {
            authority.add(new SimpleGrantedAuthority("STUDENT"));
            return authority;
        }
        TeacherEntity teacherEntity = teacherRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("ログインしなおしてください"));
        if (teacherEntity.getAuthorityFlag()) {
            authority.add(new SimpleGrantedAuthority("ADMIN_SCHOOL"));
        } else {
            authority.add(new SimpleGrantedAuthority("TEACHER"));
        }
        return authority;
    }

    @Override
    public void logout(@NonNull Integer userId) {
        refreshTokenRepository.deleteById(userId);
    }
}
