package com.example.backend.posts.controller;

import com.example.backend.posts.dto.TimelinePostsRequest;
import com.example.backend.posts.dto.ProfilePostsRequest;
import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostsReplyRequest;
import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.model.BookmarkEntity;

import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.service.PostService;
import com.example.backend.posts.service.BookmarkService;
import lombok.extern.log4j.Log4j2;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Log4j2
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;
    private final BookmarkService bookmarkService;

    //投稿を作成
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> insertPost(@Valid @ModelAttribute PostInsertRequest postRequest) { 
        // @ModelAttributeを使うことで、画像とテキストを一つのDTOで受け取れます
        try {
            log.info("投稿の作成を開始しました。 "+ postRequest);
            postService.insertPost(postRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("投稿の作成に失敗しました。", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //タイムライン投稿を取得
    @GetMapping("/timeline")
    public ResponseEntity<List<PostDetailResponse>> getTimelinePosts(@Valid @RequestBody TimelinePostsRequest requestDto){
        List<PostDetailResponse> timelinePosts;
        try{
            timelinePosts = postService.getTimelinePosts(requestDto);
        }catch(Exception e){
            log.error("タイムライン投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        
        return ResponseEntity.ok(timelinePosts);
    }

    //ユーザー投稿を取得
    @GetMapping("/profile")
    public ResponseEntity<List<PostDetailResponse>> getUserPosts(@Valid @RequestBody ProfilePostsRequest requestDto){
        List<PostDetailResponse> userPosts;
        try{
            userPosts = postService.getUserPosts(requestDto);
        }catch(Exception e){
            log.error("ユーザー投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok(userPosts);
    }
    
    //返信投稿を取得
    @GetMapping("/responses")
    public ResponseEntity<List<PostDetailResponse>> getReplyPosts(@Valid @RequestBody PostsReplyRequest requestDto){
        List<PostDetailResponse> responsePosts;
        try{
            responsePosts = postService.getReplyPosts(requestDto);
        }catch(Exception e){
            log.error("返信投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(responsePosts);
    }
    
    //ブックマーク追加
    @PostMapping("/bookmarks/add")
    public ResponseEntity<Void> addBookmark(@Valid @RequestBody BookmarkEntity bookmark) {
        try {
            bookmarkService.addBookmark(bookmark);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("ブックマークの追加に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
    }

    //ブックマーク削除
    @PostMapping("/bookmarks/remove")
    public ResponseEntity<Void> removeBookmark(@Valid @RequestBody BookmarkEntity bookmark) {
        try {
            bookmarkService.removeBookmark(bookmark);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("ブックマークの削除に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
    }

    //ブックマーク取得
    @GetMapping("/bookmarks/{userId}")
    public ResponseEntity<List<PostDetailResponse>> getBookmarkedPosts(@PathVariable Integer userId){
        List<PostDetailResponse> bookmarkedPosts;
        try{
            bookmarkedPosts = bookmarkService.getBookmarkedPosts(userId);
        }catch(Exception e){
            log.error("ブックマーク投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(bookmarkedPosts);
    }
    
    //投稿を削除
    @DeleteMapping("/{postId}/user/{userId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId, @PathVariable Integer userId){
        try{
            postService.deletePost(postId, userId);
        }catch(Exception e){
            log.error("投稿の削除に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok().build();
    }
}