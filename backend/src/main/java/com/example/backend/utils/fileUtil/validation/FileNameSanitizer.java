package com.example.backend.utils.fileUtil.validation;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Component;

import java.text.Normalizer;

@Component 
public class FileNameSanitizer {

    public String sanitizeOriginalName(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("file is empty");
        }

        String original = file.getOriginalFilename();
        if (original == null || original.isBlank()) {
            throw new IllegalArgumentException("original filename is blank");
        }

        // 1) パス成分を除去（"../../a.txt" → "a.txt", "C:\a.txt" → "a.txt"）
        String base = FilenameUtils.getName(original);

        // 2) Unicode正規化（見た目が紛らわしい文字の揺れをある程度抑える）
        base = Normalizer.normalize(base, Normalizer.Form.NFKC);

        // 3) 制御文字除去（改行・タブなど）
        base = base.replaceAll("[\\p{Cntrl}]", "");

        // 4) 許可文字だけ残す（日本語/英数/空白/._-()[] を許可例）
        base = base.replaceAll("[^\\p{IsHan}\\p{IsHiragana}\\p{IsKatakana}a-zA-Z0-9 \\._\\-\\(\\)\\[\\]]", "_");

        // 5) 長さ制限
        int max = 100;
        if (base.length() > max) {
            // 拡張子を残して詰める
            String ext = FilenameUtils.getExtension(base);
            String name = FilenameUtils.getBaseName(base);
            int keep = Math.max(1, max - (ext.isEmpty() ? 0 : (ext.length() + 1)));
            name = name.substring(0, Math.min(name.length(), keep));
            base = ext.isEmpty() ? name : name + "." + ext;
        }

        // 6) 最終チェック（空になったら弾く）
        if (base.isBlank()) {
            throw new IllegalArgumentException("sanitized filename is blank");
        }

        return base;
    }
}
