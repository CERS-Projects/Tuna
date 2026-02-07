package com.example.backend.posts.controller;

import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.model.SearchHistoryItem;
import com.example.backend.posts.dto.AddBookmarkRequest;
import com.example.backend.posts.dto.AddLikeRequest;

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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.http.MediaType;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.backend.auth.dto.UserInfo;

import org.springframework.http.ResponseEntity;
import java.util.List;
import org.bson.types.ObjectId;
import jakarta.validation.constraints.Size;

@Log4j2
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final BookmarkService bookmarkService;
    private final LikeService likeService;
    private final SearchHistoryService searchHistoryService;

    // 投稿を作成
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> insertPost(@Valid @ModelAttribute final PostInsertRequest postRequest,
            @AuthenticationPrincipal final UserInfo userInfo) {
        // JWTから取得したユーザーIDをセット
        log.info("投稿の作成を開始しました。 " + "userId: {}, content: {}, imageCount: {}",
                userInfo.getUserId(),
                postRequest.getSentence(),
                postRequest.getResponseTo(),
                postRequest.getShareRange(),
                postRequest.getImageFile() != null ? postRequest.getImageFile().size() : 0);

        postService.insertPost(postRequest, userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    // 投稿の単体取得
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponse> findPostById(@PathVariable final String postId,
            @AuthenticationPrincipal final UserInfo userInfo) {
        PostDetailResponse postDetail;
        postDetail = postService.getPostById(postId, userInfo.getUserId());
        return ResponseEntity.ok(postDetail);
    }

    // タイムライン投稿を取得
    @GetMapping("/timeline")
    public ResponseEntity<List<PostDetailResponse>> getTimelinePosts(@RequestParam final Integer shareRange,
            @AuthenticationPrincipal final UserInfo userInfo) {
        List<PostDetailResponse> timelinePosts;

        timelinePosts = postService.getTimelinePosts(shareRange, userInfo.getUserId());
        return ResponseEntity.ok(timelinePosts);
    }

    // ユーザー投稿を取得
    @GetMapping("/profile")
    public ResponseEntity<List<PostDetailResponse>> getUserPosts(@RequestParam final Integer targetUserId,
            @AuthenticationPrincipal final UserInfo userInfo) {
        List<PostDetailResponse> userPosts;

        userPosts = postService.getUserPosts(targetUserId, userInfo.getUserId());
        return ResponseEntity.ok(userPosts);
    }

    // 返信投稿を取得
    @GetMapping("/responses")
    public ResponseEntity<List<PostDetailResponse>> getReplyPosts(@RequestParam final String replypostId,
            @AuthenticationPrincipal final UserInfo userInfo) {
        List<PostDetailResponse> responsePosts;

        responsePosts = postService.getReplyPosts(replypostId, userInfo.getUserId());
        return ResponseEntity.ok(responsePosts);
    }

    // キーワード検索投稿を取得
    @GetMapping("/search")
    public ResponseEntity<List<PostDetailResponse>> getPostsByKeyword(
            @RequestParam @Size(min = 1, max = 100, message = "キーワードは1文字以上100文字以下で入力してください") final String keyword,
            @AuthenticationPrincipal final UserInfo userInfo, @RequestParam final List<Integer> shareRange) {
        List<PostDetailResponse> searchedPosts;

        // 検索履歴の追加
        searchHistoryService.addSearchHistory(userInfo.getUserId(), keyword);
        searchedPosts = postService.getPostsByKeyword(keyword, userInfo.getUserId(), shareRange);
        return ResponseEntity.ok(searchedPosts);
    }

    // ブックマーク追加
    @PostMapping("/addbookmarks")
    public ResponseEntity<Void> addBookmark(@RequestBody AddBookmarkRequest addBookmark,
            @AuthenticationPrincipal final UserInfo userInfo) {
        log.info("ブックマークの追加を開始しました userId: {} and postId: {}", userInfo.getUserId(), addBookmark.getPostId());
        bookmarkService.addBookmark(new ObjectId(addBookmark.getPostId()), userInfo.getUserId());
        return ResponseEntity.ok().build();

    }

    // ブックマーク削除
    @DeleteMapping("/removebookmarks")
    public ResponseEntity<Void> removeBookmark(@RequestParam final String postId,
            @AuthenticationPrincipal final UserInfo userInfo) {
        try {
            bookmarkService.removeBookmark(new ObjectId(postId), userInfo.getUserId());
        } catch (Exception e) {
            log.error("ブックマークの削除に失敗しました userId: {} and postId: {} エラー: {}", userInfo.getUserId(), postId, e);
            throw new RuntimeException("ブックマークの削除に失敗しました");
        }
        log.info("ブックマークが正常に削除されました userId: {} and postId: {}", userInfo.getUserId(), postId);
        return ResponseEntity.ok().build();
    }

    // ブックマーク取得
    @GetMapping("/bookmarks")
    public ResponseEntity<List<PostDetailResponse>> getBookmarkedPosts(
            @AuthenticationPrincipal final UserInfo userInfo) {
        List<PostDetailResponse> bookmarkedPosts;
        bookmarkedPosts = bookmarkService.getBookmarkedPosts(userInfo.getUserId());
        return ResponseEntity.ok(bookmarkedPosts);
    }

    // いいね追加
    @PostMapping("/addLikes")
    public ResponseEntity<Void> addLikes(@RequestBody AddLikeRequest addLikeRequest,
            @AuthenticationPrincipal final UserInfo userInfo) {
        likeService.addLikes(new ObjectId(addLikeRequest.getPostId()), userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    // いいね削除
    @DeleteMapping("/removelikes")
    public ResponseEntity<Void> removeLikes(@RequestParam final String postId,
            @AuthenticationPrincipal final UserInfo userInfo) {
        try {
            likeService.removeLikes(new ObjectId(postId), userInfo.getUserId());
        } catch (Exception e) {
            log.error("いいねの削除に失敗しました userId: {} and postId: {} エラー: {}", userInfo.getUserId(), postId, e);
            throw new RuntimeException("いいねの削除に失敗しました");
        }
        return ResponseEntity.ok().build();
    }

    // いいね取得
    @GetMapping("/likes")
    public ResponseEntity<List<PostDetailResponse>> getLikedPosts(@AuthenticationPrincipal final UserInfo userInfo) {
        List<PostDetailResponse> likedPosts;

        likedPosts = likeService.getLikedPosts(userInfo.getUserId());
        return ResponseEntity.ok(likedPosts);
    }

    // 検索履歴を取得
    @GetMapping("/searchhistory")
    public ResponseEntity<List<SearchHistoryItem>> getHistory(@AuthenticationPrincipal final UserInfo userInfo) {
        final List<SearchHistoryItem> response = searchHistoryService.getSearchHistory(userInfo.getUserId());
        return ResponseEntity.ok(response);
    }

    // 検索履歴を削除
    @DeleteMapping("/searchhistory")
    public ResponseEntity<Void> removeSearchHistory(
            @RequestParam @Size(min = 1, max = 100, message = "キーワードは1文字以上100文字以下で入力してください") final String keyword,
            @AuthenticationPrincipal final UserInfo userInfo) {

        searchHistoryService.removeSearchHistory(userInfo.getUserId(), keyword);
        return ResponseEntity.ok().build();
    }

    // 投稿を削除
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deletePost(@RequestParam final String postId,
            @AuthenticationPrincipal final UserInfo userInfo) {

        postService.deletePost(postId, userInfo.getUserId());

        return ResponseEntity.ok().build();
    }
}