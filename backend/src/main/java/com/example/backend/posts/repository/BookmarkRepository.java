package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.BookmarkEntity;
import java.util.List;

@Repository
public interface BookmarkRepository extends MongoRepository<BookmarkEntity, String> {

    // ユーザーIDと投稿IDでブックマークの存在を確認
    boolean existsByUserIdAndPostId(String userId, String postId);

    // ユーザーIDと投稿IDでブックマークを削除
    void deleteByUserIdAndPostId(String userId, String postId);

    // ユーザーIDでブックマークしている投稿IDのリストを取得
    List<String> findPostIdsByUserId(String userId);
}
