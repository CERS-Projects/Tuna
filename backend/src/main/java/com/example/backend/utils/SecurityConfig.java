package com.example.backend.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/* TUNAに関するセキュリティ関係のアノテーションを使用するためのコンフィグファイル */
@Configuration
public class SecurityConfig {
    
     /* BCryptPassWordEncoderを使えるよう作るための定義 */
    @Bean
    BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
