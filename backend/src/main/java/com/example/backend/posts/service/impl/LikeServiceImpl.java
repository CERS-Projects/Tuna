package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import com.example.backend.posts.repository.LikeRepository;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.posts.repository.PostCounterRepository;
import com.example.backend.posts.repository.PostRepository;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.model.LikeEntity;
import com.example.backend.posts.service.LikeService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;


@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class LikeServiceImpl implements LikeService {

    
    private final LikeRepository likeRepository;

    private final FileControlHelper fileControlHelper;

    private final PostCounterRepository postCounterRepository;

    private final PostRepository postRepository;


    //投稿の存在確認
    private boolean existsPost(ObjectId postId) {
        return postRepository.existsById(postId);
    }

    //いいねの存在確認
    private boolean isLiked(ObjectId postId, Integer userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    //いいね追加
    @Override
    public void addLikes(ObjectId postId, Integer userId) {
        LikeEntity like = new LikeEntity();
        like.setUserId(userId);
        like.setPostId(postId);
        like.setLikedAt(Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant()));

        if (!existsPost(postId)) {
            log.info("投稿が存在しません userId: {} and postId: {}", userId, postId);
            throw new IllegalStateException("投稿が存在しません");
        }

        if (isLiked(postId, userId)) {
            log.info("すでにいいねされています userId: {} and postId: {}", userId, postId);
            throw new IllegalStateException("すでにいいねされています");

        }
        try{
            likeRepository.save(like);
            postCounterRepository.incrementLikeCount(postId);
            log.info("いいねが正常に追加されました userId: {} and postId: {}", userId, postId);

        } catch(Exception e){
            log.error("いいねの追加に失敗しました userId: {} and postId: {} エラー: {}" , userId, postId, e);
            throw new RuntimeException("いいねの追加に失敗しました");
        }
    }
    
    //いいね削除
    @Override
    public void removeLikes(ObjectId postId, Integer userId) {

        if (!isLiked(postId, userId)) {
            log.info("いいねが存在しません userId: {} and postId: {}", userId, postId);
            throw new IllegalStateException("いいねが存在しません");
        }
        try{
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            postCounterRepository.decrementLikeCount(postId);
            log.info("いいねが正常に削除されました userId: {} and postId: {}", userId, postId);
        } catch(Exception e){
            log.error("いいねの削除に失敗しました userId: {} and postId: {} エラー: {}" , userId, postId, e);
            throw new RuntimeException("いいねの削除に失敗しました");
        }
    }
    
    //いいね取得
    @Override
    public List<PostDetailResponse> getLikedPosts(Integer userId) {
        List<PostDetailResponse> postDetails = List.of();

        try{
            postDetails = likeRepository.findByLiked(userId);

            for (PostDetailResponse postDetail : postDetails) {
                postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
                postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            }

            log.info("いいねした投稿の取得に成功しました userId: {}", userId);
            return postDetails;
        } catch(Exception e){
            log.error("いいねした投稿の取得に失敗しました userId: {} エラー: {}", userId, e);
            throw new RuntimeException("いいねした投稿の取得に失敗しました");
        }
    }
}

