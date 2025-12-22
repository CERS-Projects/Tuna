package com.example.backend.utils.fileUtil.validation;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class ImageFileValidation {

    private final Tika tika = new Tika();

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MIN_FILE_SIZE = 10; //10バイト


    // 許可するMIMEタイプのリスト（ここに追加・削除するだけでOK）
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"
    );
    /**
     * 画像ファイルかどうかを判定するメソッド
     */
    public boolean isImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        //サイズチェック
        if( file.getSize() > MAX_FILE_SIZE )  return false;
        if ( file.getSize() < MIN_FILE_SIZE )  return false;

        // ファイルの中身を読み取ってMIMEタイプを検出
        try (InputStream stream = file.getInputStream()) {

            // Tikaでファイルの中身からMIMEタイプを検出
            String detectedMimeType = tika.detect(stream);

            // 許可リストに含まれているかチェック
            return ALLOWED_MIME_TYPES.contains(detectedMimeType);

        } catch (IOException e) {
            log.error("Error detecting MIME type for file: {}", file.getOriginalFilename(), e);
            return false;
        }
    }
}