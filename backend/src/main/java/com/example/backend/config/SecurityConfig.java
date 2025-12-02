package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // POST を許可するため CSRF を無効化
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // 全てのエンドポイントを認証不要にする
                );
        return http.build();
    }
}
