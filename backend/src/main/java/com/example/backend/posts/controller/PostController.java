package com.example.backend.posts.controller;

import com.example.backend.posts.dto.PostDetailDto;
import com.example.backend.posts.dto.GetTimelineRequestDto;
import com.example.backend.posts.dto.PostInsertRequestDto;

import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.service.impl.PostServiceImpl;
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
    
    private final PostServiceImpl postService;

    //投稿を作成
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> insertPost(@Valid @ModelAttribute PostInsertRequestDto postRequest) { 
        // @ModelAttributeを使うことで、画像とテキストを一つのDTOで受け取れます
        try {
            postService.insertPost(postRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("投稿の作成に失敗しました。", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //タイムライン投稿を取得
    @GetMapping("/timeline")
    public ResponseEntity<List<PostDetailDto>> getTimelinePosts(@Valid @ModelAttribute GetTimelineRequestDto requestDto){
        List<PostDetailDto> timelinePosts;
        try{
            timelinePosts = postService.getTimelinePosts(requestDto);
        }catch(Exception e){
            log.error("タイムライン投稿の取得に失敗しました。", e);
            return ResponseEntity.status(500).build();
        }
        
        return ResponseEntity.ok(timelinePosts);
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