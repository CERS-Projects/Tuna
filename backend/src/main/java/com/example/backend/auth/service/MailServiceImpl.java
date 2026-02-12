package com.example.backend.auth.service;

import org.springframework.beans.factory.annotation.Value;
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

    private String fromMailAddress = System.getenv("MAIL_ADDRESS");

    @Override
    public void sendMail(UserEntity userEntity, String otpPassword) {

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromMailAddress);
            mailMessage.setTo(userEntity.getMailAddress());
            mailMessage.setSubject("ワンタイムパスワード発行");
            mailMessage.setText("ワンタイムパスワードの期限は5分です\n" + otpPassword);
            mailSender.send(mailMessage);
        } catch (MailException e) {
            throw new IllegalStateException("メール送信で内部エラーが発生しました、もう一度初めからやり直してください");
        }

    }

    @Override
    public void sendMail(String mailAddress, String url) {

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromMailAddress);
            mailMessage.setTo(mailAddress);
            mailMessage.setSubject("パスワードリセットご案内");
            mailMessage.setText("下記のURLをクリックしてください。URLの期限は10分です\n" + url);
            mailSender.send(mailMessage);
        } catch (MailException e) {
            throw new IllegalStateException("メール送信で内部エラーが発生しました、もう一度初めからやり直してください");
        }

    }
}
