package com.example.backend.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.model.LoginUserDetails;
import com.example.backend.auth.model.RefreshTokenEntity;

import com.example.backend.auth.repository.RefreshTokenRepository;
import com.example.backend.exception.AuthException;
import com.example.backend.utils.jwt.JwtUtils;

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
    private final JwtUtils jwtUtils;
    private final LoginUserDetailsServiceImpl loginUserDetailsServiceImpl;
    private final LoginAttemptService loginAttemptService;
    private String hashJwtRefreshToken;
    private final StringRedisTemplate stringRedisTemplate;

    public LoginTokenResponse login(LoginSelectRequest loginSelectRequest) {
        String lockUserKey = loginSelectRequest.getShowUserId() + "LockUser";

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

            LoginUserDetails loginUserDetails = (LoginUserDetails) authentication.getPrincipal();

            // JWTトークンに付与する権限を取得
            String role = loginUserDetails.getAuthorities().iterator().next().getAuthority();
            System.out.println(role);

            // springに知らせるためのを作成
            SecurityContext context = SecurityContextHolder.getContext();

            // springに知らせることでこのリクエストではどこからでも認証・認可確認可能
            context.setAuthentication(authentication);

            // トークン生成
            UserEntity userEntity = userRepository.findByShowUserId(authentication.getName());
            String jwtAccessToken = jwtUtils.createToken((userEntity.getUserId()).toString(), role);
            String jwtRefreshToken = jwtUtils.createRefreshToken(loginSelectRequest.getShowUserId());
            try {
                MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
                byte[] hash = sha256.digest(jwtRefreshToken.getBytes(StandardCharsets.UTF_8));
                hashJwtRefreshToken = HexFormat.of().formatHex(hash);
            } catch (NoSuchAlgorithmException e) {
                throw new IllegalStateException("SHA-256 not supported", e);
            }

            refreshTokenRepository
                    .save(new RefreshTokenEntity(userEntity.getUserId(), hashJwtRefreshToken));
            // リフレッシュトークンをcookieに入れる
            ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtRefreshToken)
                    .httpOnly(true)
                    .sameSite("Strict")
                    .maxAge(7 * 24 * 60 * 60)
                    .build();

            return new LoginTokenResponse(jwtAccessToken, responseCookie);
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(loginSelectRequest.getShowUserId());
            throw new AuthException("ログインIDまたはパスワードが異なります");
        }
    }

    public LoginTokenResponse refreshTokenCheck(String refreshToken) {

        try {
            DecodedJWT decodeRefreshToken = jwtUtils.confirmRefreshToken(refreshToken);
            String showUserId = decodeRefreshToken.getSubject();
            UserEntity userEntity = userRepository.findByShowUserId(showUserId);
            RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findByUserId(userEntity.getUserId());

            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] hash = sha256.digest(refreshToken.getBytes(StandardCharsets.UTF_8));
            hashJwtRefreshToken = HexFormat.of().formatHex(hash);
            System.out.println(hashJwtRefreshToken);
            if (hashJwtRefreshToken.equals(refreshTokenEntity.getRefreshToken())) {
                LoginUserDetails loginUserDetails = (LoginUserDetails) loginUserDetailsServiceImpl
                        .loadUserByUsername(showUserId);
                String role = loginUserDetails.getAuthorities().iterator().next().getAuthority();
                String jwtAccessToken = jwtUtils.createToken(showUserId, role);
                String jwtRefreshToken = jwtUtils.createRefreshToken(showUserId);
                log.info("新しいアクセストークン" + jwtAccessToken);
                log.info("新しいリフレッシュトークン" + jwtRefreshToken);
                hash = sha256.digest(jwtRefreshToken.getBytes(StandardCharsets.UTF_8));
                String newHashJwtRefreshToken = HexFormat.of().formatHex(hash);
                refreshTokenRepository
                        .save(new RefreshTokenEntity(userEntity.getUserId(), newHashJwtRefreshToken));
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtRefreshToken)
                        .httpOnly(true)
                        .sameSite("Strict")
                        .maxAge(7 * 24 * 60 * 60)
                        .path("/api/refresh")
                        .build();
                return new LoginTokenResponse(jwtAccessToken, responseCookie);
            } else {
                throw new AuthException("ログインしなおしてください");
            }

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not supported", e);
        }
    }

    public void logout(@NonNull Integer userId) {
        refreshTokenRepository.deleteById(userId);
    }
}
