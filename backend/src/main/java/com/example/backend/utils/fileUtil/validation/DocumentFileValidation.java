package com.example.backend.utils.fileUtil.validation;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class DocumentFileValidation {

    private final Tika tika = new Tika();

    // ドキュメントは画像より大きくなる傾向があるため、例えば20MBに設定
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; 
    private static final int MIN_FILE_SIZE = 10; // 空ファイル対策

    // 許可するMIMEタイプのリスト
    // PDF, Word(新/旧), Excel(新/旧), PowerPoint(新/旧), CSV
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        // PDF
        "application/pdf",
        
        // Word
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        
        // Excel
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        
        // PowerPoint
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx

        // CSV (TikaはCSVをtext/plainと判定することもあるため両方許可するのが一般的)
        "text/csv",
        "text/plain" 
    );

    /**
     * ドキュメントファイル（PDF, Office, CSV）かどうかを判定するメソッド
     */
    public boolean isValidDocumentFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        // サイズチェック
        if (file.getSize() > MAX_FILE_SIZE) return false;
        if (file.getSize() < MIN_FILE_SIZE) return false;

        try (InputStream stream = file.getInputStream()) {
            // Tikaで中身からMIMEタイプを検出
            String detectedMimeType = tika.detect(stream);
            log.debug("Detected MIME type: {}", detectedMimeType);
            

            // CSVの特例判定: text/plain の場合は拡張子も念のため確認する
            if ("text/plain".equals(detectedMimeType)) {
                String filename = file.getOriginalFilename();
                return filename != null && filename.toLowerCase().endsWith(".csv");
            }

            return ALLOWED_MIME_TYPES.contains(detectedMimeType);

        } catch (IOException e) {
            log.error("File validation failed", e);
            return false;
        }
    }
}