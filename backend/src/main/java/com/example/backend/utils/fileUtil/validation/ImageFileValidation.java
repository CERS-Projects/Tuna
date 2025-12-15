package com.example.backend.utils.fileUtil.validation;


import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.io.IOException;

@Component
public class ImageFileValidation {
    
    public boolean isValidImageFile(MultipartFile file) {

        byte[] header = new byte[12];

        if (file == null || file.isEmpty()) {
            return false;
        }
        try (InputStream is = file.getInputStream()){
            int bytesRead = is.read(header);

            if (bytesRead < 3) {
                return false;
            }
            
            return isJpeg(header) || isPng(header) || isGif(header) || isWebp(header) || isBmp(header) || isGif89a(header);

        }catch(IOException e){
            return false;
        }
    }

    // JPEG:  FF D8 FF
    private boolean isJpeg(byte[] h) {
        return h[0] == (byte) 0xFF && h[1] == (byte) 0xD8 && h[2] == (byte) 0xFF;
    }

    // PNG: 89 50 4E 47
    private boolean isPng(byte[] h) {
        return h[0] == (byte) 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47;
    }

    // GIF: "GIF8"
    private boolean isGif(byte[] h) {
        return h[0] == 0x47 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x38;
    }

    // WebP: "RIFF" + "WEBP"
    private boolean isWebp(byte[] h) {
        return h[0] == 0x52 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x46 &&
        h[8] == 0x57 && h[9] == 0x45 && h[10] == 0x42 && h[11] == 0x50;
    }

    // BMP: "BM"
    private boolean isBmp(byte[] h) {
        return h[0] == 0x42 && h[1] == 0x4D;
    }
    //GIF89a: 47 49 46 38 39 61
    private boolean isGif89a(byte[] h) {
        return h[0] == 0x47 && h[1] == 0x49 && h[2] == 0x46 && h[3] == 0x38 &&
            h[4] == 0x39 && h[5] == 0x61;
    }

}
