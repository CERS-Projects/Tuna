package com.example.backend.posts.service.impl;

import com.example.backend.posts.dto.GetTimelineRequestDto;
import com.example.backend.posts.dto.GetProfilePostsRequestDto;
import com.example.backend.posts.dto.PostInsertRequestDto;
import com.example.backend.posts.dto.PostDetailDto;
import com.example.backend.posts.model.PostEntity;

import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.repository.LikeRepository;
import com.example.backend.posts.repository.BookmarkRepository;

import com.example.backend.posts.service.PostService;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {
    
    private final PostRepository postRepository;

    private final FileControlHelper fileControlHelper;

    private final LikeRepository likeRepository;

    private final BookmarkRepository bookmarkRepository;
    
    // 投稿作成
    public void insertPost(PostInsertRequestDto post) {
        PostEntity postEntity = new PostEntity();
        List<String> fileObjectKey = null;

        if(post.getImageFile() != null){
            fileObjectKey = fileControlHelper.uploadFile("images",post.getImageFile());
            log.info("ファイルアップロード成功: " + String.join(", ", fileObjectKey));
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        postEntity.setUserId(post.getUser_id());
        postEntity.setSentence(post.getSentence());
        postEntity.setPostDate(Date.from(now.toInstant()));
        postEntity.setImageObjectKey(fileObjectKey);
        postEntity.setShareRange(post.getShareRange());
        //初期値はfalse
        postEntity.setPostFlag(false);
        postEntity.setLikeCount(0);
        postEntity.setResponseTo(null);

        try {
        postRepository.save(postEntity);
        } catch (Exception e) {
            // ファイル削除
            if(fileObjectKey != null){
                fileControlHelper.deleteFile(fileObjectKey.toArray(new String[0]));
            }
            log.error("投稿の保存に失敗しました。", e);
            throw new RuntimeException("投稿の保存に失敗しました。", e);
        }
    }

    //タイムライン投稿取得
    public List<PostDetailDto> getTimelinePosts(GetTimelineRequestDto requestDto) {
        List<PostDetailDto> postDetails;
        try{
            postDetails = postRepository.findPostsWithDetails(requestDto.getUserId(), requestDto.getShareRange(), requestDto.getMuteWords());
            log.info("画像" + postDetails.get(0).getImageUrl());
        }catch(Exception e){
            log.error("タイムライン投稿の取得に失敗しました。", e);
            throw new RuntimeException("タイムライン投稿の取得に失敗しました。", e);
        }
        for(PostDetailDto postDetail : postDetails){
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
        }

    //ユーザー投稿取得
    public List<PostDetailDto> getUserPosts(GetProfilePostsRequestDto requestDto) {
        List<PostDetailDto> postDetails;
        try{
            log.info("取得を開始しました 相手targetUserId: " + requestDto.getTargetUserId() + " 取得 currentUserId: " + requestDto.getCurrentUserId() );
            postDetails = postRepository.findUserPostsWithDetails(requestDto.getCurrentUserId(), requestDto.getTargetUserId(), requestDto.getGroupIds());
        }catch(Exception e){
            log.error("ユーザー投稿の取得に失敗しました。", e);
            throw new RuntimeException("ユーザー投稿の取得に失敗しました。", e);
        }
        for(PostDetailDto postDetail : postDetails){
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
    }

    // 投稿削除
    public void deletePost(String postId, Integer userId) {
        //投稿IDチェック
        if(postId == null || postId.isEmpty()){
            throw new IllegalArgumentException("投稿IDが無効です。");
        }

        //ユーザーチェック
        if(!postRepository.existsByIdAndUserId(postId, userId)){
            throw new IllegalArgumentException("投稿の削除権限がありません。");
        }
        try{
            postRepository.deleteById(postId);
        } catch(Exception e){
            throw new RuntimeException("投稿の削除に失敗しました。", e);
        }
    }

}