package com.example.backend.utils.fileUtil.helper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.utils.fileUtil.s3.service.S3StorageService;
import com.example.backend.utils.fileUtil.validation.DocumentFileValidation;
import com.example.backend.utils.fileUtil.validation.ImageFileValidation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FileControlHelper {

    private final S3StorageService s3StorageService;
    private final ImageFileValidation imageValidator;
    private final DocumentFileValidation documentValidator;

    //ファイルをアップロードする
    public List<String> uploadFile(String directory, MultipartFile... files) {

        // 保存先ディレクトリのチェック
        if (directory == null || directory.isBlank()) {
            throw new IllegalArgumentException("保存先ディレクトリが指定されていません");
        }
        List<String> keyList = new ArrayList<>();

        try {
            for(MultipartFile file : files){
                // ファイルの種類に応じたバリデーション
                validateFile(file, directory);
                // S3にアップロード
                keyList.add(s3StorageService.uploadFile(file, directory));
                log.info("ファイルアップロード成功: key={}", keyList.get(keyList.size() - 1));
            
            }
            return keyList;
        } catch (Exception e) {
            log.error("ファイルアップロードに失敗しました", e);
            for (String key : keyList) {
                try {
                    s3StorageService.deleteFile(key);
                    log.info("アップロード失敗に伴うファイル削除成功: key={}", key);
                } catch (Exception ex) {
                    log.error("アップロード失敗に伴うファイル削除に失敗しました手動で削除してください: key={}", key, ex);
                }
            }
            throw new RuntimeException("ファイルアップロードに失敗しました");
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
                if (!imageValidator.isImageFile(file)) {
                    throw new IllegalArgumentException("無効な画像ファイルです");
                }
            }
            default -> {
                // その他のディレクトリは例外として扱う
                log.warn("未知のディレクトリ: {}（バリデーションをスキップ）", directory);
                throw new IllegalArgumentException("未知のディレクトリです: " + directory);
                
            }
        }
    }

    //署名付きURLを取得する（有効期限指定）
    public String getFileUrl(String key) {
        if (key == null || key.isBlank() ) {
            return null;
        }

        // ファイルの存在確認
        try {
            if (!s3StorageService.doesObjectExist(key)) {
                log.warn("指定されたファイルが存在しません: key={}", key);
                return null;
            }
        } catch (Exception e) {
            log.error("ファイル存在確認中にエラーが発生しました: key={}", key, e);
            return null;
            }

        // 署名付きURLを生成
        try{
            return s3StorageService.generatePresignedUrl(key);
        } catch (Exception e) {
            log.error("署名付きURLの生成に失敗しました: key={}", key, e);
            return null;
        }
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
    public void deleteFile(String... filekeys) {

            if(filekeys == null || filekeys.length == 0) {
                throw new IllegalArgumentException("削除するファイルのキーが指定されていません");

            }
            if(filekeys.length > 5){
                throw new IllegalArgumentException("一度に削除できるファイルの数を超えています");
            }

        try {
            for(String key : filekeys) {
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
        } catch (Exception e) {
            log.error("ファイル削除に失敗しました:" + e);
            throw new RuntimeException("ファイル削除に失敗しました");
        }
    }
}  