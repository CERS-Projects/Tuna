package com.example.backend.utils.fileUtil.helper;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web. multipart.MultipartFile;

import com.example.backend.utils.fileUtil.s3.service.S3StorageServiceImpl;
import com.example.backend.utils.fileUtil.validation.DocumentFileValidation;
import com.example.backend.utils.fileUtil. validation.ImageFileValidation;

import lombok.RequiredArgsConstructor;
import lombok.extern. slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileControlHelper {

    private final S3StorageServiceImpl s3StorageService;
    private final ImageFileValidation imageValidator;
    private final DocumentFileValidation documentValidator;

    //ファイルをアップロードする
    public String uploadFile(MultipartFile file, String directory) {
        // 入力チェック
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("アップロードファイルが指定されていません");
        }

        if (directory == null || directory.isBlank()) {
            throw new IllegalArgumentException("保存先ディレクトリが指定されていません");
        }
        // ファイルの種類に応じたバリデーション
        validateFile(file, directory);
        // S3にアップロード
        try {
            String key = s3StorageService. uploadFile(file, directory);
            log.info("ファイルアップロード成功: key={}", key);
            return key;
        } catch (IOException e) {
            log.error("ファイルアップロードに失敗しました", e);
            throw new RuntimeException("ファイルアップロードに失敗しました", e);
        }
    }


    //ファイルの種類に応じたバリデーション     
    private void validateFile(MultipartFile file, String directory) {
        switch (directory) {
            case "documents" -> {
                if (! documentValidator.isValidDocumentFile(file)) {
                    throw new IllegalArgumentException("無効なドキュメントファイルです");
                }
            }
            case "images" -> {
                if (!imageValidator.isValidImageFile(file)) {
                    throw new IllegalArgumentException("無効な画像ファイルです");
                }
            }
            default -> {
                // その他のディレクトリはバリデーションなし
                log.warn("未知のディレクトリ: {}（バリデーションをスキップ）", directory);
            }
        }
    }

    //署名付きURLを取得する（有効期限指定）
    public String getFileUrl(String key) {
        if (key == null || key. isBlank() ) {
            return null;
        }

        return s3StorageService.generatePresignedUrl(key);
    }


    //複数の署名付きURLを一括取得する（有効期限指定）
    public Map<String, String> getMultiFileUrl(List<String> keys) {
        Map<String, String> urls = new HashMap<>();

        if (keys == null || keys.isEmpty()) {
            return urls;
        }

        for (String key : keys) {
            String url = getFileUrl(key);
            if (url != null) {
                urls.put(key, url);
            }
        }

        return urls;
    }

    //ファイルを削除する
    public void deleteFile(String key) {
        if (key == null || key.isBlank()) {
            throw new IllegalArgumentException("削除するファイルのキーが指定されていません");
        }
        if (!s3StorageService.doesObjectExist(key)) {
            log.warn("削除対象のファイルが存在しません: key={}", key);
            throw new RuntimeException("削除対象のファイルが存在しません");
        }

        s3StorageService.deleteFile(key);
        log.info("ファイル削除成功: key={}", key);
    }
}