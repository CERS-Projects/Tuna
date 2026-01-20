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

    public String getUsername() {
        return user.getShowUserId();
    }

    public String getPassword() {
        return user.getPassword();
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    public boolean isAccountNonExpired() {
        return true;
    }

    public boolean isAccountNonLocked() {
        return true;
    }

    public boolean isCredentialsNonExpired() {
        return true;
    }

    public boolean isEnabled() {
        return true;
    }

}
