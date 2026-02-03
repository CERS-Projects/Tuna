package com.example.backend.config;

import java.io.IOException;
import java.util.List;

import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.auth.service.LoginAttemptService;
import com.example.backend.exception.model.InternalSecurityException;
import com.example.backend.utils.jwt.JwtUtils;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final LoginAttemptService loginAttemptService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String sub;
        Integer schoolId;
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        // トークンがないとき
        if (header == null || header.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }
        // トークンがあってもベアラートークンではない時
        if (!header.startsWith("Bearer ")) {
            request.setAttribute("ERROR_MESSAGE", "トークンが不正です");
            throw new BadCredentialsException("");
        }
        String token = header.substring(7);
        try {
            DecodedJWT successToken = jwtUtils.confirmToken(token);
            sub = successToken.getSubject();
            schoolId = successToken.getClaim("schoolId").asInt();

            if (schoolId == null || sub == null) {
                throw new InternalSecurityException("");
            }

            UserInfo userInfo = new UserInfo(Integer.parseInt(sub), schoolId);

            String role = successToken.getClaim("role").asString();
            List<GrantedAuthority> authority = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            Authentication authentication = new UsernamePasswordAuthenticationToken(userInfo, null, authority);
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authentication);

        } catch (TokenExpiredException e) {
            request.setAttribute("ERROR_MESSAGE", "トークンの有効切れです");
            throw new BadCredentialsException("");
        } catch (JWTVerificationException e) {
            request.setAttribute("ERROR_MESSAGE", "トークンが不正です");
            throw new BadCredentialsException("");
        } catch (InternalSecurityException e) {
            request.setAttribute("IS_INTERNAL_ERROR", true);
            request.setAttribute("ERROR_MESSAGE", "サーバー内部でエラーが発生しました");
            throw new InternalSecurityException("");
        }
        // アカウント停止フラグチェック
        loginAttemptService.isStop(request, sub);
        filterChain.doFilter(request, response);
    }
}
