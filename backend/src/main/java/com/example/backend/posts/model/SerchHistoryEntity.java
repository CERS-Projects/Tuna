package com.example.backend.posts.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@Document(collection = "search_history_collection")
public class SerchHistoryEntity {
    @Id
    private String id;

    @NonNull
    @Field("user_id")
    private Integer userId;

    @NonNull
    @Field("query")
    private List<String> query;

    @NonNull
    @Field("searched_at")
    private String searchedAt;
}
