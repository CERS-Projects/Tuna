package com.example.backend.auth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

@Service
public class HashServiceImpl implements HashService {
    @Override
    public String toHash(String data) {
        String hashData;
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] hash = sha256.digest(data.getBytes(StandardCharsets.UTF_8));
            hashData = HexFormat.of().formatHex(hash);
            return hashData;
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 not supported", e);
        }

    }
}
