package com.example.backend.posts.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public  class SearchHistoryItem {
        @NotNull
        private String query;

        @NotNull
        private Date searched_at;
    }
