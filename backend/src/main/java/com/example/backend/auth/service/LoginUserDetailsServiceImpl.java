package com.example.backend.auth.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.model.LoginUserDetails;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class LoginUserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {

        UserEntity userEntity = userRepository.findByShowUserId(id)
                .orElseThrow(() -> new UsernameNotFoundException("ユーザーIDまたはパスワードが異なります"));
        List<GrantedAuthority> authority = new ArrayList<>();
        Integer userId = userEntity.getUserId();
        if (teacherRepository.existsByUserId(userId).equals(false)) {
            authority.add(new SimpleGrantedAuthority("STUDENT"));
            return new LoginUserDetails(userEntity, authority);
        }

        TeacherEntity teacherEntity = teacherRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("ログインしなおしてください"));

        if (teacherEntity.getAuthorityFlag()) {
            authority.add(new SimpleGrantedAuthority("ADMIN_SCHOOL"));
        } else {
            authority.add(new SimpleGrantedAuthority("TEACHER"));
        }

        return new LoginUserDetails(userEntity, authority);

    }
}
