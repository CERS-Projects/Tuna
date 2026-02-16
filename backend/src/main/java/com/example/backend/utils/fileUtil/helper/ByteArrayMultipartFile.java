package com.example.backend.utils.fileUtil.helper;

import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * byte配列をMultipartFileとして扱うためのラッパークラス。
 * クラスパスリソースなどをアップロードする際に使用する。
 */
public class ByteArrayMultipartFile implements MultipartFile {

    private final String name;
    private final String originalFilename;
    private final String contentType;
    private final byte[] content;

    public ByteArrayMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
        this.name = name;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.content = content.clone();
    }

    @Override
    @NonNull
    public String getName() { return name; }

    @Override
    public String getOriginalFilename() { return originalFilename; }

    @Override
    public String getContentType() { return contentType; }

    @Override
    public boolean isEmpty() { return content.length == 0; }

    @Override
    public long getSize() { return content.length; }

    @Override
    @NonNull
    public byte[] getBytes() { return content.clone(); }

    @Override
    @NonNull
    public InputStream getInputStream() { return new ByteArrayInputStream(content); }

    @Override
    public void transferTo(@NonNull File dest) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(content);
        }
    }
}
