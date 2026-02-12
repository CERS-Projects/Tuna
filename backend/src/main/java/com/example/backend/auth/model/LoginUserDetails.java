package com.example.backend.auth.model;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.backend.accounts.model.UserEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class LoginUserDetails implements UserDetails {
    private final UserEntity user;
    private final Collection<? extends GrantedAuthority> authorities;

    @Override
    public String getUsername() {
        return user.getShowUserId();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
