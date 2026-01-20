package com.example.backend.utils.jwt;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import com.auth0.jwt.HeaderParams;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.*;
import com.auth0.jwt.interfaces.*;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class JwtUtils {

    public String createToken(String userId, String role) {

        String secretKey = System.getenv("SECRET_KEY");
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put(HeaderParams.ALGORITHM, "HS256");
        headerMap.put(HeaderParams.TYPE, "JWT");

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(60 * 30);

        String token = JWT.create()
                .withHeader(headerMap)
                // 発行者名
                .withIssuer("TUNA")
                // ユーザの識別子
                .withSubject(userId)
                // 権限
                .withClaim("role", role)
                // 有効期限
                .withExpiresAt(exp)
                // 指定したアルゴリズム
                .sign(algorithm);

        return token;
    }

    public String createRefreshToken(String userId) {
        String secretKey = System.getenv("SECRET_KEY");
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put(HeaderParams.ALGORITHM, "HS256");
        headerMap.put(HeaderParams.TYPE, "refresh");

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(60 * 60);

        String refreshToken = JWT.create()
                .withHeader(headerMap)
                .withIssuer("TUNA")
                .withSubject(userId)
                .withExpiresAt(exp)
                .sign(algorithm);

        return refreshToken;
    }

    public DecodedJWT confirmToken(String token) {

        // 秘密鍵は環境変数から読み込む
        String secretKey = System.getenv("SECRET_KEY");
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verificationTool = JWT.require(algorithm)
                .withIssuer("TUNA")
                .build();
        DecodedJWT correctToken = verificationTool.verify(token);
        System.out.println("テストテスト" + correctToken.getSubject());
        return correctToken;
    }

    public DecodedJWT confirmRefreshToken(String refreshToken) {
        String secretKey = System.getenv("SECRET_KEY");
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verificationTool = JWT.require(algorithm)
                .withIssuer("TUNA")
                .build();
        DecodedJWT correctToken = verificationTool.verify(refreshToken);
        return correctToken;
    }

    public String getUserFormToken(DecodedJWT token) {
        String sub = token.getSubject();
        return sub;
    }

}
