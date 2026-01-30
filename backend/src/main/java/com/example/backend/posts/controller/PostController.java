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
import java.util.List;

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
        log.info("投稿の作成を開始しました。 "+ "userId: {}, content: {}, imageCount: {}",
            postRequest.getUserId(),
            postRequest.getSentence(),
            postRequest.getImageFile() != null ? postRequest.getImageFile().size() : 0);

        postService.insertPost(postRequest);
        return ResponseEntity.ok().build();
    }


    //タイムライン投稿を取得
    @GetMapping("/timeline")
    public ResponseEntity<List<PostDetailResponse>> getTimelinePosts(@Valid @RequestBody TimelinePostsRequest requestDto){
        List<PostDetailResponse> timelinePosts;
        
        timelinePosts = postService.getTimelinePosts(requestDto);       
        return ResponseEntity.ok(timelinePosts);
    }


    //ユーザー投稿を取得
    @GetMapping("/profile")
    public ResponseEntity<List<PostDetailResponse>> getUserPosts(@Valid @RequestBody ProfilePostsRequest requestDto){
        List<PostDetailResponse> userPosts;

        userPosts = postService.getUserPosts(requestDto);
        return ResponseEntity.ok(userPosts);    
    }
    

    //返信投稿を取得
    @GetMapping("/responses")
    public ResponseEntity<List<PostDetailResponse>> getReplyPosts(@Valid @RequestBody PostsReplyRequest requestDto){
        List<PostDetailResponse> responsePosts;
        
        responsePosts = postService.getReplyPosts(requestDto);
        return ResponseEntity.ok(responsePosts);
    }

    //キーワード検索投稿を取得
    @GetMapping("/search")
    public ResponseEntity<List<PostDetailResponse>> getPostsByKeyword(@Valid @RequestBody SearchPostsRequest requestDto){
        List<PostDetailResponse> searchedPosts;
        
        //検索履歴の追加
        searchHistoryService.addSearchHistory(requestDto.getCurrentUserId(), requestDto.getKeyword());
        searchedPosts = postService.getPostsByKeyword(requestDto);
        return ResponseEntity.ok(searchedPosts);
    }
    
    //ブックマーク追加
    @PostMapping("/addbookmarks")
    public ResponseEntity<Void> addBookmark(@Valid @RequestBody IsBookmarkRequest requestDto) {
            bookmarkService.addBookmark(requestDto);
            return ResponseEntity.ok().build();
        
    }

    //ブックマーク削除
    @DeleteMapping("/removebookmarks")
    public ResponseEntity<Void> removeBookmark(@Valid @RequestBody IsBookmarkRequest requestDto) {
    
        bookmarkService.removeBookmark(requestDto);
        log.info("ブックマークが正常に削除されました userId: {} and postId: {}", requestDto.getUserId(), requestDto.getPostId());
        return ResponseEntity.ok().build();
    }

    //ブックマーク取得
    @GetMapping("/bookmarks/{userId}")
    public ResponseEntity<List<PostDetailResponse>> getBookmarkedPosts(@PathVariable Integer userId){
        List<PostDetailResponse> bookmarkedPosts;
        
        bookmarkedPosts = bookmarkService.getBookmarkedPosts(userId);
        return ResponseEntity.ok(bookmarkedPosts);
    }

    //いいね追加
    @PostMapping("/addlikes")
    public ResponseEntity<Void> addLikes(@Valid @RequestBody IsLikeRequest requestDto) {
        likeService.addLikes(requestDto);
        return ResponseEntity.ok().build();
    }
    
    //いいね削除
    @DeleteMapping("/removelikes")
    public ResponseEntity<Void> removeLikes(@Valid @RequestBody IsLikeRequest requestDto){
        likeService.removeLikes(requestDto);
        return ResponseEntity.ok().build();
    }
    
    //いいね取得
    @GetMapping("/likes/{userId}")
    public ResponseEntity<List<PostDetailResponse>> getLikedPosts(@PathVariable Integer userId){
        List<PostDetailResponse> likedPosts;
        
        likedPosts = likeService.getLikedPosts(userId);
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
        
        searchHistoryService.removeSearchHistory(requestDto.getUserId(), requestDto.getKeyword());
        return ResponseEntity.ok().build();
    }
    
    //投稿を削除
    @DeleteMapping("/{postId}/user/{userId}")
    public ResponseEntity<Void> deletePost(@PathVariable String postId, @PathVariable Integer userId){
        
        postService.deletePost(postId, userId);

        return ResponseEntity.ok().build();
    }
}