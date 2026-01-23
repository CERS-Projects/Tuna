package com.example.backend.posts.service.impl;

import com.example.backend.posts.dto.TimelinePostsRequest;
import com.example.backend.posts.dto.ProfilePostsRequest;
import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostsReplyRequest;
import com.example.backend.posts.dto.SearchPostsRequest;    
import com.example.backend.posts.model.PostEntity;
import org.bson.types.ObjectId;



import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.repository.LikeRepository;
import com.example.backend.posts.repository.BookmarkRepository;
import com.example.backend.posts.model.PostEntity;

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
import org.springframework.web.multipart.MultipartFile;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {
    
    private final PostRepository postRepository;

    private final FileControlHelper fileControlHelper;
    
    // 投稿作成
    @Override
    public void insertPost(PostInsertRequest post) {
        PostEntity postEntity = new PostEntity();
        List<String> fileObjectKeys = null;
        List<MultipartFile> imageFiles = post.getImageFile();
        ObjectId replyPost = null;

        if(imageFiles != null){
            fileObjectKeys = fileControlHelper.uploadFile("images", imageFiles.toArray(new MultipartFile[0]));
            log.info("ファイルアップロード成功: {}", String.join(", ", fileObjectKeys));
            
        }
        //返信投稿設定
        if (post.getResponseTo() != null && !post.getResponseTo().isEmpty()) {
            replyPost = new ObjectId(post.getResponseTo()); 
            log.info("投稿が{}", postRepository.existsById(replyPost.toHexString()));
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        postEntity.setUserId(post.getUser_id());
        postEntity.setSentence(post.getSentence());
        postEntity.setPostDate(Date.from(now.toInstant()));
        postEntity.setImageObjectKey(fileObjectKeys);
        postEntity.setShareRange(post.getShareRange());
        //初期値はtrue
        postEntity.setPostFlag(true);
        postEntity.setLikeCount(0);
        postEntity.setResponseTo(replyPost);
        postEntity.setResponseCount(0);
        try {
        postRepository.save(postEntity);
        if (postEntity.getResponseTo() != null) {
                log.info("返信元投稿のresponse_Countをインクリメントします。 投稿ID: {}", replyPost.toHexString());
                long result = postRepository.incrementResponseCount(replyPost);
                if (result == 0) {
                    log.warn("返信元投稿のresponse_Countのインクリメントに失敗しました。該当する投稿が見つかりません。 投稿ID:{} " , replyPost.toHexString());
                    throw new RuntimeException("返信元投稿のresponse_Countのインクリメントに失敗しました。該当する投稿が見つかりません。");
                } else {
                    log.info("返信元投稿のresponse_Countを正常にインクリメントしました。 投稿ID: {}", replyPost.toHexString());
                }
            }
        } catch (Exception e) {
            // ファイル削除
            log.info("投稿の保存に失敗したため、アップロードしたファイルを削除します。");
            if(fileObjectKeys != null){
                fileControlHelper.deleteFile(fileObjectKeys.toArray(new String[0]));
            }
            log.error("投稿の保存に失敗しました。", e);
            throw new RuntimeException("投稿の保存に失敗しました。", e);
        }
    }

    //タイムライン取得
    @Override
    public List<PostDetailResponse> getTimelinePosts(TimelinePostsRequest requestDto) {
        try {
            List<PostDetailResponse> postDetails =
                postRepository.findPostsWithDetails(
                    requestDto.getUserId(),
                    requestDto.getShareRange(),
                    requestDto.getMuteWords()
                );

            log.info("タイムライン投稿 件数={}", postDetails.size());
            if (!postDetails.isEmpty()) {
                log.info("画像(先頭)={}", postDetails.get(0).getImageUrl());
            }

            for (PostDetailResponse postDetail : postDetails) {
                postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
                postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            }

            return postDetails;

        } catch (Exception e) {
            log.error("タイムライン投稿の取得に失敗しました。", e);
            throw new RuntimeException("タイムライン投稿の取得に失敗しました。", e);
        }
    }

    //ユーザー投稿取得
    @Override
    public List<PostDetailResponse> getUserPosts(ProfilePostsRequest requestDto) {
        List<PostDetailResponse> postDetails;
        try{
            log.info("取得を開始しました 相手targetUserId: " + requestDto.getTargetUserId() + " 取得 currentUserId: " + requestDto.getCurrentUserId() );
            postDetails = postRepository.findUserPostsWithDetails(requestDto.getCurrentUserId(), requestDto.getTargetUserId(), requestDto.getGroupIds());
            log.info("取得完了しました。 投稿数: " + postDetails);
        }catch(Exception e){

            log.error("ユーザー投稿の取得に失敗しました。", e.getMessage(), e);
            e.printStackTrace();
            throw new RuntimeException("ユーザー投稿の取得に失敗しました。", e);
        }
        for(PostDetailResponse postDetail : postDetails){
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
    }
    //返信取得
    @Override
    public List<PostDetailResponse> getReplyPosts(PostsReplyRequest requestDto) {
        List<PostDetailResponse> postDetails;
        try{
            log.info("返信取得を開始しました 投稿ID: " + requestDto.getReplyPostId() + " 取得 currentUserId: " + requestDto.getCurrentUserId() );
            postDetails = postRepository.findPostsResponseWithDetails(requestDto.getCurrentUserId(), requestDto.getReplyPostId(), requestDto.getMuteWords());
        }catch(Exception e){
            log.error("返信投稿の取得に失敗しました。", e.getMessage(), e);
            e.printStackTrace();
            throw new RuntimeException("返信投稿の取得に失敗しました。", e);
        }
        for(PostDetailResponse postDetail : postDetails){
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
    }

    //キーワード検索投稿取得
    @Override
    public List<PostDetailResponse> getPostsByKeyword(SearchPostsRequest requestDto) {
        List<PostDetailResponse> postDetails;
        try{
            
            log.info("キーワード検索投稿取得を開始しました キーワード: " + requestDto.getKeyword() + " 取得 currentUserId: " + requestDto.getCurrentUserId() );
            postDetails = postRepository.findPostsByKeywordWithDetails(requestDto.getCurrentUserId(), requestDto.getKeyword());
        }catch(Exception e){
            log.error("キーワード検索投稿の取得に失敗しました。", e.getMessage(), e);
            e.printStackTrace();
            throw new RuntimeException("キーワード検索投稿の取得に失敗しました。", e);
        }
        for(PostDetailResponse postDetail : postDetails){
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