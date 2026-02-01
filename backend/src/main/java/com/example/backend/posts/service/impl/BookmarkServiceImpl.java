package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.posts.service.BookmarkService;
import com.example.backend.posts.repository.BookmarkRepository;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.posts.repository.PostRepository;

import com.example.backend.posts.model.BookmarkEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import org.bson.types.ObjectId;

import lombok.RequiredArgsConstructor;

import com.example.backend.posts.dto.PostDetailResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    private final FileControlHelper fileControlHelper;

    private final PostRepository postRepository;

    //投稿の存在確認
    private boolean existsPost(ObjectId postId) {
        return postRepository.existsById(postId);
    }

    //ブックマークの存在確認
    private boolean isBookmarked(Integer userId, ObjectId postId) {
        return bookmarkRepository.existsByUserIdAndPostId(userId, postId);
    }

    //ブックマークの追加
    @Override
    public void addBookmark(ObjectId postId, Integer userId) {
        BookmarkEntity bookmark = new BookmarkEntity();
        bookmark.setUserId(userId);
        bookmark.setPostId(postId);
        bookmark.setBookmarkedAt(Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant()));

        if (!existsPost(bookmark.getPostId())) {
            log.info("投稿が存在しません userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
            throw new IllegalStateException("投稿が存在しません");
        }

        if (isBookmarked(bookmark.getUserId(), bookmark.getPostId())) {
            log.info("すでにブックマークされています userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
            throw new IllegalStateException("すでにブックマークされています");
        }
        try{
        bookmarkRepository.save(bookmark);
        log.info("ブックマークが正常に追加されました userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
        } catch(Exception e){
            log.error("ブックマークの追加に失敗しました userId: {} and postId: {} エラー: {}" , bookmark.getUserId(), bookmark.getPostId(), e);
            throw new RuntimeException("ブックマークの追加に失敗しました");
        }
    }

    @Override
    public void removeBookmark(ObjectId postId, Integer userId) {

        if (!isBookmarked(userId, postId)) {
            log.info("ブックマークが存在しません userId: {} and postId: {}", userId, postId);
            throw new IllegalStateException("ブックマークが存在しません");
        }
        try{
        bookmarkRepository.deleteByUserIdAndPostId(userId, postId);
        log.info("ブックマークが正常に削除されました userId: {} and postId: {}", userId, postId);
        } catch(Exception e){
            log.error("ブックマークの削除に失敗しました userId: {} and postId: {} エラー: {}" , userId, postId, e);
            throw new RuntimeException("ブックマークの削除に失敗しました");
        }
    }
    @Override
    public List<PostDetailResponse> getBookmarkedPosts(Integer userId) {
        List<PostDetailResponse> postDetails = null;
        try{
            postDetails = bookmarkRepository.findByBookmarked(userId);

            for (PostDetailResponse postDetail : postDetails) {
                postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
                postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            }

        } catch(Exception e) {
            log.error("ブックマーク投稿の取得に失敗しました userId: {} エラー: {}", userId, e);
            throw new RuntimeException("ブックマーク投稿の取得に失敗しました");
        }
        return postDetails;
    }
}