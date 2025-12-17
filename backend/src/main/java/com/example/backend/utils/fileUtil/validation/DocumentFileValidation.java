package com.example.backend.utils.fileUtil.validation;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


@Component
public class DocumentFileValidation {
    
    public boolean isValidDocumentFile(MultipartFile file) {

        byte[] header = new byte[5];
        if (file == null || file.isEmpty()) {
            return false;
        }
        try {
            file.getInputStream().read(header);
            return isPdf(header) || isDocx(header) || isXlsx(header) || isPptx(header) || isCsv(header) ;
        } catch (Exception e) {
            return false;
        }
    }
    // PDF: 25 50 44 46 2D
    private boolean isPdf(byte[] h) {
        return h[0] == 0x25 && h[1] == 0x50 && h[2] == 0x44 && h[3] == 0x46 && h[4] == 0x2D;
    }   
    // DOCX: 50 4B 03 04 14
    private boolean isDocx(byte[] h) {
        return h[0] == 0x50 && h[1] == 0x4B && h[2] == 0x03 && h[3] == 0x04 && h[4] == 0x14;
    }
    // XLSX: 50 4B 03 04 14
    private boolean isXlsx(byte[] h) {
        return h[0] == 0x50 && h[1] == 0x4B && h[2] == 0x03 && h[3] == 0x04 && h[4] == 0x14;
    }
    // PPTX: 50 4B 03 04 14
    private boolean isPptx(byte[] h) {
        return h[0] == 0x50 && h[1] == 0x4B && h[2] == 0x03 && h[3] == 0x04 && h[4] == 0x14;
    }
    
    //CSV: 23 63 6F 6D 6D
    private boolean isCsv(byte[] h) {
        return h[0] == 0x23 && h[1] == 0x63 && h[2] == 0x6F && h[3] == 0x6D && h[4] == 0x6D;
    }

}
