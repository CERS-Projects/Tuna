package com.example.backend.posts.controller;

import com.example.backend.posts.dto.TimelinePostsRequest;
import com.example.backend.posts.dto.ProfilePostsRequest;
import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostsReplyRequest;
import com.example.backend.posts.dto.IsBookmarkRequest;
import com.example.backend.posts.dto.SearchPostsRequest;
import com.example.backend.posts.model.SearchHistoryEntity;
import com.example.backend.posts.model.SearchHistoryItem;
import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.model.BookmarkEntity;
import com.example.backend.posts.dto.IsLikeRequest;
import com.example.backend.posts.dto.SearchHistoryRemoveRequest;

import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.service.PostService;
import com.example.backend.posts.service.BookmarkService;
import com.example.backend.posts.service.LikeService;
import com.example.backend.posts.service.SearchHistoryService;

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
    private final LikeService likeService;
    private final SearchHistoryService searchHistoryService;
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

    //キーワード検索投稿を取得
    @GetMapping("/search")
    public ResponseEntity<List<PostDetailResponse>> getPostsByKeyword(@Valid @RequestBody SearchPostsRequest requestDto){
        List<PostDetailResponse> searchedPosts;
        try{
            //検索履歴の追加
            searchHistoryService.addSearchHistory(requestDto.getCurrentUserId(), requestDto.getKeyword());
            searchedPosts = postService.getPostsByKeyword(requestDto);
        }catch(Exception e){
            log.error("キーワード検索投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(searchedPosts);
    }
    
    //ブックマーク追加
    @PostMapping("/addbookmarks")
    public ResponseEntity<Void> addBookmark(@Valid @RequestBody IsBookmarkRequest requestDto) {
        try {
            bookmarkService.addBookmark(requestDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("ブックマークの追加に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
    }

    //ブックマーク削除
    @DeleteMapping("/removebookmarks")
    public ResponseEntity<Void> removeBookmark(@Valid @RequestBody IsBookmarkRequest requestDto) {
        try {
            bookmarkService.removeBookmark(requestDto);
            log.info("ブックマークが正常に削除されました userId: {} and postId: {}", requestDto.getUserId(), requestDto.getPostId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("ブックマークの削除に失敗しました。 userId: {} and postId: {} エラー: {}", requestDto.getUserId(), requestDto.getPostId(), e);
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
            log.error("ブックマーク投稿の取得に失敗しました。 userId: {} エラー: {}", userId, e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(bookmarkedPosts);
    }

    //いいね追加
    @PostMapping("/addlikes")
    public ResponseEntity<Void> addLikes(@Valid @RequestBody IsLikeRequest requestDto) {
        try {
            likeService.addLikes(requestDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("いいねの追加に失敗しました。 userId: {} and postId: {} エラー: {}", requestDto.getUserId(), requestDto.getPostId(), e);
            return ResponseEntity.status(500).build();
        }
    }
    
    //いいね削除
    @DeleteMapping("/removelikes")
    public ResponseEntity<Void> removeLikes(@Valid @RequestBody IsLikeRequest requestDto)
    {
        try {
            likeService.removeLikes(requestDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("いいねの削除に失敗しました。 userId: {} and postId: {} エラー: {}", requestDto.getUserId(), requestDto.getPostId(), e);
            return ResponseEntity.status(500).build();
        }
    }
    
    //いいね取得
    @GetMapping("/likes/{userId}")
    public ResponseEntity<List<PostDetailResponse>> getLikedPosts(@PathVariable Integer userId){
        List<PostDetailResponse> likedPosts;
        try{
            likedPosts = likeService.getLikedPosts(userId);
        }catch(Exception e){
            log.error("いいねした投稿の取得に失敗しました。 userId: {} エラー: {}", userId, e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(likedPosts);
    }

    //検索履歴を取得
    @GetMapping("/searchhistory/{userId}")
    public ResponseEntity<List<SearchHistoryItem>> getHistory(
            @PathVariable Integer userId
    ) {
        List<SearchHistoryItem> response = searchHistoryService.getSearchHistory(userId);
        return ResponseEntity.ok(response);
    }

    //検索履歴を削除
    @DeleteMapping("/searchhistory")
    public ResponseEntity<Void> removeSearchHistory(@RequestBody SearchHistoryRemoveRequest requestDto) {
        try{
            searchHistoryService.removeSearchHistory(requestDto.getUserId(), requestDto.getKeyword());
        }catch(Exception e){
            log.error("検索履歴の削除に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok().build();
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