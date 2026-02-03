package com.example.backend.auth.service;

import java.util.List;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.model.RefreshTokenEntity;
import com.example.backend.auth.repository.RefreshTokenRepository;
import com.example.backend.exception.AuthException;
import com.example.backend.school.model.SchoolEntity;
import com.example.backend.utils.jwt.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

        private final AuthService authService;
        private final HashService hashService;
        private final UserRepository userRepository;
        private final RefreshTokenRepository refreshTokenRepository;
        private final JwtUtils jwtUtils;

        @Override
        public LoginTokenResponse jwtCreate(Integer userId) {
                String hashJwtRefreshToken;
                UserEntity userEntity = userRepository.findById(userId)
                                .orElseThrow(() -> new AuthException("ログインをしなおしてください"));

                List<GrantedAuthority> authorities = authService.giveAuthority(userEntity);
                String role = authorities.get(0).getAuthority();

                SchoolEntity schoolEntity = userEntity.getSchool();

                String jwtAccessToken = jwtUtils.createToken((userEntity.getUserId()).toString(), role,
                                schoolEntity.getSchoolId());
                String jwtRefreshToken = jwtUtils.createRefreshToken(userEntity.getUserId().toString());
                hashJwtRefreshToken = hashService.toHash(jwtRefreshToken);
                refreshTokenRepository
                                .save(new RefreshTokenEntity(userEntity.getUserId(), hashJwtRefreshToken));
                // リフレッシュトークンをcookieに入れる
                ResponseCookie responseCookie = ResponseCookie.from("refreshToken",
                                jwtRefreshToken)
                                .httpOnly(true)
                                .sameSite("Lax")
                                .maxAge(7 * 24 * 60 * 60)
                                .path("/api/refresh")
                                .build();
                return new LoginTokenResponse(jwtAccessToken, responseCookie);
        }

        @Override
        public LoginTokenResponse refreshTokenCheck(String refreshToken) {
                String hashJwtRefreshToken;
                DecodedJWT decodeRefreshToken = jwtUtils.confirmRefreshToken(refreshToken);
                String userId = decodeRefreshToken.getSubject();
                Integer userIdInteger;

                try {
                        userIdInteger = Integer.parseInt(userId);
                } catch (NumberFormatException e) {
                        throw new IllegalStateException("サーバー内部でエラーが発生しました");
                }

                RefreshTokenEntity refreshTokenEntity = refreshTokenRepository.findById(userIdInteger)
                                .orElseThrow(() -> new AuthException("ログインしなおしてください"));

                hashJwtRefreshToken = hashService.toHash(refreshToken);

                if (hashJwtRefreshToken.equals(refreshTokenEntity.getRefreshToken())) {
                        UserEntity userEntity = userRepository.findById(userIdInteger)
                                        .orElseThrow(() -> new UsernameNotFoundException("ログインしなおしてください"));

                        SchoolEntity schoolEntity = userEntity.getSchool();

                        List<GrantedAuthority> authorities = authService.giveAuthority(userEntity);
                        String role = authorities.get(0).getAuthority();
                        String jwtAccessToken = jwtUtils.createToken(userId, role, schoolEntity.getSchoolId());
                        String jwtRefreshToken = jwtUtils.createRefreshToken(userId);
                        String newHashJwtRefreshToken = hashService.toHash(jwtRefreshToken);

                        refreshTokenRepository
                                        .save(new RefreshTokenEntity(userIdInteger, newHashJwtRefreshToken));
                        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", jwtRefreshToken)
                                        .httpOnly(true)
                                        .sameSite("Lax")
                                        .maxAge(7 * 24 * 60 * 60)
                                        .path("/api/refresh")
                                        .build();
                        return new LoginTokenResponse(jwtAccessToken, responseCookie);
                } else {
                        throw new AuthException("ログインしなおしてください");
                }

        }

}
