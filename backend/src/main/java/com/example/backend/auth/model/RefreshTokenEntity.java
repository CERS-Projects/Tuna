package com.example.backend.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refresh_token_tb")
@Entity
public class RefreshTokenEntity {
    @Id
    @Column(name = "user_id")
    private Integer userId;

    @NotBlank
    @Size(min = 1, max = 64)
    @Column(name = "refresh_token")
    private String refreshToken;
}
