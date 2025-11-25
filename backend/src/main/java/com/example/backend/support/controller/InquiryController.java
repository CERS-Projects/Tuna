package com.example.backend.support.controller;

import com.example.backend.support.service.InquiryService;
import com.mongodb.lang.NonNull;

import lombok.RequiredArgsConstructor;

import com.example.backend.support.dto.InquiryInsertRequest;
import com.example.backend.support.dto.InquiryUpdateRequest;
import com.example.backend.support.dto.InquiryDeleteRequest;
import com.example.backend.support.model.InquiryEntity;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Date;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/inquiry")
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping("/insert")
    //問い合わせの登録(Responceで返す値がないためvoidで定義)
    public ResponseEntity<Void> insertInquiry(@RequestBody  InquiryInsertRequest inquiryRequest) {

        //DTOからEntityへの変換
        InquiryEntity inquiryEntity = new InquiryEntity();
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        inquiryEntity.setSubject(inquiryRequest.getSubject());
        inquiryEntity.setContent(inquiryRequest.getContent());
        inquiryEntity.setMailaddress(inquiryRequest.getMailaddress());
        inquiryEntity.setDatetime(Date.from(now.toInstant()));
        inquiryEntity.setInquiry_status(inquiryRequest.getInquiry_status());
        System.out.println(inquiryEntity);
        //サービス層を通じて登録処理を実行
        try{
        inquiryService.insertInquiry(inquiryEntity);
        } catch (Exception e) {

            //エラーハンドリング（例：ログ出力、適切なレスポンスコードの返却など）
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        //登録成功をフロントに返す
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    


    @GetMapping("/getInquiries")
    public ResponseEntity<List<InquiryEntity>> selectInquiry() {
        try {
            List<InquiryEntity> inquiries = inquiryService.selectInquiry();
            System.out.println(inquiries);
            return ResponseEntity.status(HttpStatus.OK).body(inquiries);
        } catch (Exception e) {
            // エラーハンドリング（例：ログ出力、適切なレスポンスコードの返却など）
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getInquiryById")
    public ResponseEntity<InquiryEntity> getInquiryById(@RequestParam  @NonNull String _id) {
        try {
            InquiryEntity inquiry = inquiryService.findByInquiryId(_id);
            if (inquiry != null) {
                return ResponseEntity.status(HttpStatus.OK).body(inquiry);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            // エラーハンドリング（例：ログ出力、適切なレス
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    @PutMapping("/updateStatus")
    public ResponseEntity<Void> postMethodName(@RequestBody InquiryUpdateRequest inquiry) {
        try {
            String id = inquiry.get_id();
            Integer status = inquiry.getInquiry_status();
            inquiryService.updateStatus( id, status );
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            // エラーハンドリング（例：ログ出力、適切なレスポンスコードの返却など）
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteInquiry(@RequestBody  InquiryDeleteRequest _id) {
        try {
            inquiryService.deleteInquiry( _id.get_id() );
            System.out.println("Deleted inquiry with id: " + _id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            // エラーハンドリング（例：ログ出力、適切なレスポンスコードの返却など）
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    }
};