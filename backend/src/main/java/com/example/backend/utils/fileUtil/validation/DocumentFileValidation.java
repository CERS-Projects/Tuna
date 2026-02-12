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

    private final Tika tika;

    public DocumentFileValidation(Tika tika) {
        this.tika = tika;
    }

    // 20MBに設定
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; 
    private static final int MIN_FILE_SIZE = 10; // 空ファイル対策

    // 許可するMIMEタイプのリスト
    // PDF, Word(新/旧), Excel(新/旧), PowerPoint(新/旧), CSV
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        // PDF
        "application/pdf",
        
        // CSV (TikaはCSVをtext/plainと判定することもあるため注意)
        "text/csv",

        //msoffice系の許可
        "application/x-tika-msoffice",
        "application/x-tika-ooxml",
        "application/vnd.ms-office",
        "application/vnd.openxmlformats-officedocument",
        "application/vnd.ms-word",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    /**
     * ドキュメントファイル（PDF, Office, CSV）かどうかを判定するメソッド
     */
    public boolean isValidDocumentFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.error("ファイルが空です");
            return false;
        }

        // サイズチェック
        if (file.getSize() > MAX_FILE_SIZE){
            log.error("ファイルサイズが大きすぎます: {} bytes", file.getSize());
            return false;
        }
        if (file.getSize() < MIN_FILE_SIZE){
            log.error("ファイルサイズが小さすぎます: {} bytes", file.getSize());
            return false;
        }

        try (InputStream stream = file.getInputStream()) {
            // Tikaで中身からMIMEタイプを検出
            String detectedMimeType = tika.detect(stream);

            boolean result = ALLOWED_MIME_TYPES.contains(detectedMimeType);
            if( !result ){
                log.error("許可されていないMIMEタイプです: {}", detectedMimeType);
            }

            return result;

        } catch (IOException e) {
            log.error("ファイルの検証中にエラーが発生しました", e);
            return false;
        }
    }

    public boolean isCSV(MultipartFile file){
        if(!isValidDocumentFile(file)){
            return false;
        }

        try( InputStream stream = file.getInputStream()) {
            String detectedMimeType = tika.detect(stream);
            return detectedMimeType.equals("text/csv") || detectedMimeType.equals("text/plain");
        } catch (IOException e) {
            log.error("ファイルの検証中にエラーが発生しました", e);
            return false;
        }
    }
}