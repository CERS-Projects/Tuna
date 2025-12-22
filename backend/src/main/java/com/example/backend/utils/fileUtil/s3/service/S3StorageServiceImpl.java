package com.example.backend.utils.fileUtil.s3.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class S3StorageServiceImpl  implements S3StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.region}")
    private String region;

    /*署名の有効期限 */
    private final int EXPIRATION_MINUTES = 160;

    public S3StorageServiceImpl(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    /**
     * S3 にファイルをアップロードして、保存したキーを返すメソッド
     */
    @Override
    public String uploadFile(MultipartFile file, String directory) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String safeFileName = originalFilename != null ? originalFilename : "file";

        String key = directory + "/" + System.currentTimeMillis() + "_" + safeFileName;

        String encodedKey = encodeS3Key(key);

        log.info("S3 putting file.  bucket=[{}], key={}, region={}", bucketName, encodedKey, region);
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(encodedKey)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();
        try (InputStream inputStream = file.getInputStream()) {
        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        log.info("S3 file put successfully. bucket=[{}], key={}, region={}", bucketName, encodedKey, region);

        } catch (Exception e) {
            log.error("S3ファイルアップロードエラー: bucket=[{}], key={}, region={}", bucketName, encodedKey, region, e);
            throw e;
        }
        
        return "https://" + bucketName + ".s3.amazonaws.com/" + encodedKey;
    }

    //ファイル名をエンコードするメソッド
    private String encodeS3Key(String key) {
        String[] parts = key.split("/", -1);
        StringBuilder encoded = new StringBuilder();
        
        for (int i = 0; i < parts.length; i++) {
            if (i > 0) {
                encoded.append("/");
            }
            encoded.append(URLEncoder.encode(parts[i], StandardCharsets.UTF_8)
                    .replace("+", "%20"));
        }
        
        return encoded.toString();
    }

    //署名付きURLを生成するメソッド
    @Override
    public String generatePresignedUrl(String key) {
        S3Presigner presigner = this.s3Presigner;

        //オブジェクトを取得
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        //署名付きURLを作成するリクエストを作成
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(java.time.Duration.ofMinutes(EXPIRATION_MINUTES))
                .getObjectRequest(getObjectRequest)
                .build();

        //リクエストをもとに署名付きURLを生成
        try {
        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();

        } catch (Exception e) {
            log.error("署名付きURL生成エラー: bucket=[{}], key={}", bucketName, key, e);
            throw e;
        }
        
    }



    //ファイルの存在を確認するメソッド
    @Override
    public boolean doesObjectExist(String key) {
        try {
            s3Client.headObject(builder -> builder.bucket(bucketName).key(key));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    //ファイルを削除するメソッド
    @Override
    public void deleteFile(String key) {
        try {
        s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
        } catch (Exception e) {
            log.error("S3ファイル削除エラー: bucket=[{}], key={}", bucketName, key, e);
            throw e;
        }
    }

}