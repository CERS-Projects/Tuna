package com.example.backend.auth.service;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.backend.accounts.model.UserEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendMail(UserEntity userEntity, String otpPassword) {
        System.out.println("aiueo");
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            System.out.println("aiueo");
            System.out.println(userEntity.getMailAddress());
            mailMessage.setFrom(userEntity.getMailAddress());
            System.out.println("aiueo");
            mailMessage.setTo(userEntity.getMailAddress());
            System.out.println("aiueo");
            mailMessage.setSubject("ワンタイムパスワード発行");
            System.out.println("aiueo");
            mailMessage.setText("ワンタイムパスワードの期限は5分です\n" + otpPassword);
            System.out.println("aiueo");
            mailSender.send(mailMessage);
            System.out.println("aiueo");
        } catch (MailException e) {
            throw new IllegalStateException("メール送信で内部エラーが発生しました、もう一度初めからやり直してください");
        }

    }
}
