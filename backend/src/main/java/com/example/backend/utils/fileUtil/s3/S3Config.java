package com.example.backend.utils.fileUtil.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software. amazon.awssdk.regions.Region;
import software.amazon. awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class S3Config {

    @Value("${cloud.aws.region}")
    private String region;

    @Value("${aws.access-key-id}")
    private String accessKeyId;

    @Value("${aws.secret-access-key}")
    private String secretAccessKey;

    @Bean
    public S3Client s3Client() {
        log.info("=== S3 Client Config ===");
        log.info("Region: [{}]", region);
        log.info("Access Key ID: [{}]", accessKeyId. substring(0, Math.min(5, accessKeyId.length())) + "...");
        log.info("========================");

        AwsBasicCredentials credentials = AwsBasicCredentials.create(
            accessKeyId. trim(),
            secretAccessKey.trim()
        );

        return S3Client.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.of(region. trim()))
                .build();
    }
    
    @Bean
    public S3Presigner s3Presigner() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
            accessKeyId.trim(),
            secretAccessKey.trim()
        );

        return S3Presigner.builder()
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.of(region.trim()))
                .build();
    }
}