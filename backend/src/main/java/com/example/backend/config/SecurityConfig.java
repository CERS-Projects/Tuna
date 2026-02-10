package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.SecureRandom;
import java.util.List;

@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    private final AuthenticationFilter authenticationFilter;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    SecurityConfig(AuthenticationFilter authenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            JwtAccessDeniedHandler jwtAccessDeniedHandler) {
        this.authenticationFilter = authenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .logout(logout -> logout.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/refresh", "/otp", "/support/**", "/school/create").permitAll()
                        .requestMatchers("/groups/me").hasAnyRole("STUDENT")
                        .requestMatchers("/accounts/teacher/**", "/school/information", "/school/modify")
                        .hasRole("ADMIN_SCHOOL")
                        .requestMatchers("/groups/**", "/accounts/student/**", "/notice/create", "/notice/modify",
                                "/notice/teacher/list", "/notice/delete", "/report/list", "/report/delete","classroom/create",
                                "classroom/update", "classroom/delete")
                        .hasAnyRole("TEACHER", "ADMIN_SCHOOL")
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler));
        http.addFilterBefore(authenticationFilter,
                UsernamePasswordAuthenticationFilter.class);
        http.sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecureRandom secureRandom() {
        return new SecureRandom();
    }
}
