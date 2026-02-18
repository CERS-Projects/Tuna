package com.example.backend.utils.fileUtil.validation;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
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

    // CSVヘッダーの期待値
    private static final String EXPECTED_CSV_HEADER = "showUserId,password,mailAddress,name,grade,admissionDate,graduateDate";
    private static final int EXPECTED_CSV_COLUMN_COUNT = 7;

    // 許可するMIMEタイプのリスト
    // PDF, Word(新/旧), Excel(新/旧), PowerPoint(新/旧), CSV
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        // PDF
        "application/pdf",

        // CSV (TikaはCSVをtext/plainと判定することもあるため注意)
        "text/csv",
        "text/plain",

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
        if (file.getSize() > MAX_FILE_SIZE) {
            log.error("ファイルサイズが大きすぎます: {} bytes", file.getSize());
            return false;
        }
        if (file.getSize() < MIN_FILE_SIZE) {
            log.error("ファイルサイズが小さすぎます: {} bytes", file.getSize());
            return false;
        }

        try (InputStream stream = file.getInputStream()) {
            // Tikaで中身からMIMEタイプを検出
            String detectedMimeType = tika.detect(stream);

            boolean result = ALLOWED_MIME_TYPES.contains(detectedMimeType);
            if (!result) {
                log.error("許可されていないMIMEタイプです: {}", detectedMimeType);
            }

            return result;

        } catch (IOException e) {
            log.error("ファイルの検証中にエラーが発生しました", e);
            return false;
        }
    }

    /**
     * CSVファイルかどうかを判定するメソッド
     * text/plainの場合は拡張子とヘッダー行の追加検証を行う
     */
    public boolean isCSV(MultipartFile file) {
        if (!isValidDocumentFile(file)) {
            return false;
        }

        try (InputStream stream = file.getInputStream()) {
            String detectedMimeType = tika.detect(stream);
            boolean isCsvMime = detectedMimeType.equals("text/csv");
            boolean isPlainText = detectedMimeType.equals("text/plain");

            if (!isCsvMime && !isPlainText) {
                return false;
            }

            // text/plainの場合、拡張子が.csvであることを確認
            if (isPlainText) {
                String originalFilename = file.getOriginalFilename();
                if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".csv")) {
                    log.error("text/plainファイルの拡張子が.csvではありません: {}", originalFilename);
                    return false;
                }
            }

            // ヘッダー行の検証（text/csv・text/plain共通）
            return validateCsvHeader(file);

        } catch (IOException e) {
            log.error("ファイルの検証中にエラーが発生しました", e);
            return false;
        }
    }

    /**
     * CSVファイルの先頭行（ヘッダー）が期待するカラム構成と一致するか検証する
     */
    private boolean validateCsvHeader(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.isBlank()) {
                log.error("CSVファイルのヘッダー行が空です");
                return false;
            }

            // BOM除去
            headerLine = headerLine.replace("\uFEFF", "").trim();

            // ヘッダーの完全一致チェック
            if (!headerLine.equals(EXPECTED_CSV_HEADER)) {
                // カラム数だけでも確認
                String[] columns = headerLine.split(",", -1);
                if (columns.length != EXPECTED_CSV_COLUMN_COUNT) {
                    log.error("CSVヘッダーのカラム数が不正です: 期待値={}, 実際={}", EXPECTED_CSV_COLUMN_COUNT, columns.length);
                    return false;
                }
                log.warn("CSVヘッダーが期待値と完全一致しません: {}", headerLine);
            }

            return true;

        } catch (IOException e) {
            log.error("CSVヘッダーの検証中にエラーが発生しました", e);
            return false;
        }
    }
}
