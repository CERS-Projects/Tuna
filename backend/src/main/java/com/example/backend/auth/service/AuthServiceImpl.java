package com.example.backend.auth.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.model.LoginUserDetails;
import com.example.backend.auth.model.RefreshTokenEntity;

import com.example.backend.auth.repository.RefreshTokenRepository;
import com.example.backend.exception.AuthException;
import com.example.backend.school.model.SchoolEntity;
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
    private final TeacherRepository teacherRepository;
    private final JwtUtils jwtUtils;
    private final LoginAttemptService loginAttemptService;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public LoginTokenResponse login(LoginSelectRequest loginSelectRequest) {
        String lockUserKey = loginSelectRequest.getShowUserId() + "LockUser";
        String hashJwtRefreshToken;
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

            // springに知らせるためのを作成
            SecurityContext context = SecurityContextHolder.getContext();

            // springに知らせることでこのリクエストではどこからでも認証・認可確認可能
            context.setAuthentication(authentication);

            // トークン生成
            UserEntity userEntity = userRepository.findByShowUserId(authentication.getName())
                    .orElseThrow(() -> new AuthException("ユーザーIDまたはパスワードが異なります"));

            SchoolEntity schoolEntity = userEntity.getSchool();

            String jwtAccessToken = jwtUtils.createToken((userEntity.getUserId()).toString(), role,
                    schoolEntity.getSchoolId());
            // リフレッシュトークンに入れる識別子をshowUserIdからgetUserIdに変更
            String jwtRefreshToken = jwtUtils.createRefreshToken(userEntity.getUserId().toString());
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

    @Override
    public LoginTokenResponse refreshTokenCheck(String refreshToken) {
        String hashJwtRefreshToken;
        try {
            DecodedJWT decodeRefreshToken = jwtUtils.confirmRefreshToken(refreshToken);
            String userId = decodeRefreshToken.getSubject();

            RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findById(Integer.parseInt(userId))
                    .orElseThrow(() -> new AuthException("ログインしなおしてください"));

            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] hash = sha256.digest(refreshToken.getBytes(StandardCharsets.UTF_8));
            hashJwtRefreshToken = HexFormat.of().formatHex(hash);
            if (hashJwtRefreshToken.equals(refreshTokenEntity.getRefreshToken())) {
                UserEntity userEntity = userRepository.findById(Integer.parseInt(userId))
                        .orElseThrow(() -> new UsernameNotFoundException("ログインしなおしてください"));

                SchoolEntity schoolEntity = userEntity.getSchool();

                List<GrantedAuthority> authorities = giveAuthority(userEntity);
                String role = authorities.get(0).getAuthority();
                String jwtAccessToken = jwtUtils.createToken(userId, role, schoolEntity.getSchoolId());
                String jwtRefreshToken = jwtUtils.createRefreshToken(userId);
                log.info("新しいアクセストークン" + jwtAccessToken);
                log.info("新しいリフレッシュトークン" + jwtRefreshToken);
                hash = sha256.digest(jwtRefreshToken.getBytes(StandardCharsets.UTF_8));
                String newHashJwtRefreshToken = HexFormat.of().formatHex(hash);
                refreshTokenRepository
                        .save(new RefreshTokenEntity(Integer.valueOf(userId), newHashJwtRefreshToken));
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
