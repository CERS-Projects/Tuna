package com.example.backend.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.auth.dto.AccessTokenResponse;
import com.example.backend.auth.dto.LoginResponse;
import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;
import com.example.backend.auth.dto.OtpRequest;
import com.example.backend.auth.dto.PasswordChangeRequest;
import com.example.backend.auth.dto.PasswordResetMailRequest;
import com.example.backend.auth.dto.PasswordResetRequest;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.auth.service.AuthService;
import com.example.backend.auth.service.JwtService;
import com.example.backend.auth.service.OtpService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@Transactional
@Log4j2
public class AuthController {
    private final AuthService authService;
    private final OtpService otpService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginSelectRequest loginSelectRequest) {
        String otpToken = authService.login(loginSelectRequest);
        LoginResponse loginResponse = new LoginResponse(otpToken);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refreshTokenCheck(@CookieValue("refreshToken") String refreshToken,
            Authentication authentication) {
        LoginTokenResponse loginTokenResponse = jwtService.refreshTokenCheck(refreshToken);
        AccessTokenResponse accessTokenResponse = new AccessTokenResponse(loginTokenResponse.getAccessToken());
        return ResponseEntity.ok().header("Set-Cookie",
                loginTokenResponse.getRefreshToken().toString())
                .body(accessTokenResponse);
    }

    @PostMapping("/otp")
    public ResponseEntity<AccessTokenResponse> otpPassword(@Valid @RequestBody OtpRequest otpRequest) {
        Integer userId = otpService.confirmOtp(otpRequest);
        LoginTokenResponse loginTokenResponse = jwtService.jwtCreate(userId);
        AccessTokenResponse accessTokenResponse = new AccessTokenResponse(loginTokenResponse.getAccessToken());
        return ResponseEntity.ok().header("Set-Cookie", loginTokenResponse.getRefreshToken().toString())
                .body(accessTokenResponse);
    }

    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal UserInfo userInfo) {
        authService.logout(userInfo.getUserId());
    }

    @PostMapping("/change/password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserInfo userInfo,
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        authService.changePassword(userInfo.getUserId(), passwordChangeRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset/password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody PasswordResetRequest passwordResetRequest) {
        authService.resetPassword(passwordResetRequest.getToken(), passwordResetRequest.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reset/password")
    public ResponseEntity<String> resetPasswordToken(@Valid @RequestParam String token) {
        authService.resetPasswordTokenConfirm(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset/password/mail")
    public ResponseEntity<String> resetPasswordMail(
            @Valid @RequestBody PasswordResetMailRequest passwordResetMailRequest) {
        authService.resetPasswordMail(passwordResetMailRequest.getMailAddress());
        return ResponseEntity.ok().build();
    }

}
