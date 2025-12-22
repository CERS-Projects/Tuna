package com.example.backend.utils.fileUtil.s3.service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.net.URLDecoder;

import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FilenameUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
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
    private final int EXPIRATION_MINUTES = 120;

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
    String uuid = UUID.randomUUID().toString();
    String extension = FilenameUtils.getExtension(originalFilename);

    if(extension == null || extension.isEmpty()) {
        log.error("ファイルの拡張子が取得できません: filename={}", originalFilename);
        throw new IllegalArgumentException("ファイルの拡張子が取得できません");
    }

    String cleanDirectory = (directory == null || directory.isEmpty()) ? "" : directory + "/";
    String key = cleanDirectory + uuid + "." + extension;

    log.info("S3 uploading. bucket=[{}], key={}", bucketName, key);

    // 2. Content-Disposition のエンコード（+を%20に置換）
    String encodedFileName = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8).replace("+", "%20");
    
    // RFC 5987 に準拠した形式
    String contentDisposition = "inline; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName;

    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(key) 
            .contentDisposition(contentDisposition)
            .contentType(file.getContentType())
            .contentLength(file.getSize())
            .metadata(Map.of("original-filename", encodedFileName))  // オリジナルのファイル名をメタデータとして保存
            .build();

    try (InputStream inputStream = file.getInputStream()) {
        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        log.info("S3 upload success. key={}", key);
    } catch (Exception e) {
        log.error("S3 upload failed. key={}", key, e);
        throw new RuntimeException("ファイルアップロードに失敗しました: " + e.getMessage());
    }

    //オブジェクトキーを返す
    return key; 
}


    //署名付きURLを生成するメソッド
    @Override
    public String generatePresignedUrl(String key) {

        String originalFilename = new String();
        try{
            //オブジェクトのメタデータを取得
            HeadObjectResponse head = s3Client.headObject(builder -> builder.bucket(bucketName).key(key));
            //メタデータからオリジナルのファイル名を取得
            String encodeFilename  = head.metadata().get("original-filename");
            //デコード
            originalFilename = URLDecoder.decode(encodeFilename, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("メタデータ取得エラー: bucket=[{}], key={}", bucketName, key, e);
            originalFilename = "file";
        }

        // ファイル名をダウンロード用にメタデータから取得したファイル名をUTF-8でエンコード
        String encodedFileName = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8).replace("+", "%20");

        //取得したメタデータをもとにブラウザでの表示方法とファイル名を指定(attachmentでダウンロード)
        String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName;

        //オブジェクトを取得
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .responseContentDisposition(contentDisposition)
                .build();

        //署名付きURLを作成するリクエストを作成
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(java.time.Duration.ofMinutes(EXPIRATION_MINUTES))
                .getObjectRequest(getObjectRequest) 
                .build();

        //リクエストをもとに署名付きURLを生成
        try {
        PresignedGetObjectRequest presignedRequest = this.s3Presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();

        } catch (Exception e) {
            log.error("署名付きURL生成エラー: bucket=[{}], key={}", bucketName, key, e);
            throw new RuntimeException("署名付きURLの生成に失敗しました: " + e.getMessage());
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