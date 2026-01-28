package com.example.backend.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@Transactional
@Log4j2
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody LoginSelectRequest loginSelectRequest) {
        LoginTokenResponse loginTokenResponse = authService.login(loginSelectRequest);
        return ResponseEntity.ok().header("Set-Cookie",
                loginTokenResponse.getRefreshToken().toString())
                .body(loginTokenResponse.getAccessToken());
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshTokenCheck(@CookieValue("refreshToken") String refreshToken,
            Authentication authentication) {
        LoginTokenResponse loginTokenResponse = authService.refreshTokenCheck(refreshToken);
        return ResponseEntity.ok().header("Set-Cookie",
                loginTokenResponse.getRefreshToken().toString())
                .body(loginTokenResponse.getAccessToken());
    }

    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal UserInfo userInfo) {
        authService.logout(userInfo.getUserId());
    }
}
