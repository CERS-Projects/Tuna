package com.example.backend.posts.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import jakarta.validation.constraints.NotNull; 
import java.util.List;
import org.bson.types.ObjectId;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "search_history_collection")
public class SearchHistoryEntity {
    @Id
    @MongoId(FieldType.OBJECT_ID)
    private ObjectId id;

    @NotNull
    @Field("user_id")
    private Integer userId;

    @NotNull
    @Field("search_history")
    private List<SearchHistoryItem> searchHistory;

}
