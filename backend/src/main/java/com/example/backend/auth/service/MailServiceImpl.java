package com.example.backend.auth.service;

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
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(userEntity.getMailAddress());
        mailMessage.setTo(userEntity.getMailAddress());
        mailMessage.setSubject("ワンタイムパスワード発行");
        mailMessage.setText("ワンタイムパスワードの期限は5分です\n" + otpPassword);
        mailSender.send(mailMessage);
        return;
    }
}
