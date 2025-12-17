package com.example.backend.utils.fileUtil.s3.service;

import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface S3StorageService {

    // S3 にファイルをアップロードして、保存したキーを返すメソッド
    String uploadFile(MultipartFile file, String directory) throws IOException;

    // 指定されたファイルキーに対する署名付きURLを取得するメソッド
    String generatePresignedUrl(String fileKey);

    // 指定されたファイルキーのファイルを削除するメソッド
    void deleteFile(String fileKey);

    // 指定されたファイルキーのオブジェクトが存在するか確認するメソッド
    boolean doesObjectExist(String fileKey);

}
