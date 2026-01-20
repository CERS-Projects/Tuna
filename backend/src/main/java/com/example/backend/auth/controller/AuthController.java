package com.example.backend.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@Transactional
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginSelectRequest loginSelectRequest) {
        LoginTokenResponse loginTokenResponse = authService.login(loginSelectRequest);
        System.out.println("アクセストークン" + loginTokenResponse.getAccessToken());
        System.out.println("リフレッシュトークン" + loginTokenResponse.getRefreshToken());
        return ResponseEntity.ok().header("Set-Cookie",
                loginTokenResponse.getRefreshToken().toString())
                .body(loginTokenResponse.getAccessToken());
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshTokenCheck(@CookieValue("refreshToken") String refreshToken) {
        LoginTokenResponse loginTokenResponse = authService.refreshTokenCheck(refreshToken);
        return ResponseEntity.ok().header("Set-Cookie",
                loginTokenResponse.getRefreshToken().toString())
                .body(loginTokenResponse.getAccessToken());
    }

    @PostMapping("/logout")
    public void logout(Authentication authentication) {
        authService.logout(Integer.valueOf(authentication.getPrincipal().toString()));
    }
}
