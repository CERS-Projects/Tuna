package com.example.backend.posts.service.impl;

import com.example.backend.posts.model.PostEntity;
import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import org.bson.types.ObjectId;

import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.repository.LikeRepository;
import com.example.backend.posts.repository.BookmarkRepository;
import com.example.backend.utils.accountConfirm.AccountConfirm;
import com.example.backend.utils.accountConfirm.GroupJoinByUserId;

import com.example.backend.posts.service.PostService;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {
    
    private final PostRepository postRepository;

    private final FileControlHelper fileControlHelper;

    private final LikeRepository likeRepository;

    private final BookmarkRepository bookmarkRepository;

    private final AccountConfirm accountConfirm;

    private final GroupJoinByUserId groupJoinByUserId;
    
    // 投稿作成
    @Override
    public void insertPost(PostInsertRequest post, Integer userId) {
        PostEntity postEntity = new PostEntity();
        List<String> fileObjectKeys = null;
        List<MultipartFile> imageFiles = post.getImageFile();
        ObjectId replyPost = null;


        //publicの0を除外
        List<Integer> userGroupIds =
        post.getShareRange().stream()
                .filter(i -> i != 0)
                .toList();
        //除外したリストをもとに権限確認
        if(!accountConfirm.isExistsAllGroups(userId, userGroupIds.toArray(new Integer[0]))) {
            throw new IllegalArgumentException("指定されたグループに所属していません。");
        }

        if(imageFiles != null){
            fileObjectKeys = fileControlHelper.uploadFile("images", imageFiles.toArray(new MultipartFile[0]));
            log.info("ファイルアップロード成功: {}", String.join(", ", fileObjectKeys));
            
        }
        //返信投稿設定
        if (post.getResponseTo() != null && !post.getResponseTo().isEmpty()) {
            replyPost = new ObjectId(post.getResponseTo()); 
            log.info("返信：{}", postRepository.existsById(replyPost));
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        
        postEntity.setUserId(userId);
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
                log.info("返信元投稿のresponse_countをインクリメントします。 投稿ID: {}", replyPost);
                long result = postRepository.incrementResponseCount(replyPost);
                if (result == 0) {
                    log.warn("返信元投稿のresponse_countのインクリメントに失敗しました。該当する投稿が見つかりません。 投稿ID:{} " , replyPost);
                    throw new RuntimeException("返信元投稿のresponse_countのインクリメントに失敗しました。該当する投稿が見つかりません。");
                } else {
                    log.info("返信元投稿のresponse_countを正常にインクリメントしました。 投稿ID: {}", replyPost);
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
    public List<PostDetailResponse> getTimelinePosts(Integer shareRange, Integer currentUserId) {
        List<Integer> shareRangeList = List.of(shareRange);

        if(!(shareRangeList.size() == 1 && shareRangeList.get(0) == 0)){

            //publicのみ指定されている場合、全グループ参加確認は不要
            if (!accountConfirm.isExistsAllGroups(currentUserId, shareRangeList.toArray(new Integer[0]))) {
                throw new IllegalArgumentException("指定されたグループに所属していません。");
            }
        }

        try {
            List<PostDetailResponse> postDetails =
                postRepository.findPostsWithDetails(
                    currentUserId,
                    shareRangeList,
                    getmuteWordList(currentUserId)
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
    public List<PostDetailResponse> getUserPosts(Integer targetUserId, Integer currentUserId) {
        List<PostDetailResponse> postDetails;
        List<Integer> userGroupIds = groupJoinByUserId.getJoinedGroupIdsByUserId(currentUserId);

        if (!accountConfirm.isExistsAllGroups(currentUserId, userGroupIds.toArray(new Integer[0]))) {
            throw new IllegalArgumentException("指定されたグループに所属していません。");
        }
        userGroupIds.add(0); // public権限を追加

        try{
            log.info("取得を開始しました 相手targetUserId: " + targetUserId + " 取得 currentUserId: " + currentUserId );
            postDetails = postRepository.findUserPostsWithDetails(currentUserId, targetUserId, userGroupIds);
            log.info("取得完了しました。 投稿数: " + postDetails.size());
        }catch(Exception e){

            log.error("ユーザー投稿の取得に失敗しました。", e.getMessage(), e);
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
    public List<PostDetailResponse> getReplyPosts(String replyPostId,Integer currentUserId) {
        List<PostDetailResponse> postDetails;
        
        try{
            log.info("返信取得を開始しました 投稿ID: " + replyPostId + " 取得 currentUserId: " + currentUserId );
            postDetails = postRepository.findPostsResponseWithDetails(currentUserId, new ObjectId(replyPostId), getmuteWordList(currentUserId));
        }catch(Exception e){
            log.error("返信投稿の取得に失敗しました。", e);
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
    public List<PostDetailResponse> getPostsByKeyword(String keyword, Integer currentUserId, List<Integer> shareRange) {
        List<PostDetailResponse> postDetails;

        if(!(shareRange.size() == 1 && shareRange.get(0) == 0)){
            if (!accountConfirm.isExistsAllGroups(currentUserId, shareRange.toArray(new Integer[0]))) {
                throw new IllegalArgumentException("指定されたグループに所属していません。");
            }else{
                log.info("publicのみ指定されているため、グループ所属確認をスキップします。 currentUserId: " + currentUserId);
                shareRange = List.of(0); // 条件指定がない場合publicの追加
            }
        }
        try{
            log.info("キーワード検索投稿取得を開始しました キーワード: " + keyword + " 取得 currentUserId: " + currentUserId);
            postDetails = postRepository.findPostsByKeywordWithDetails(currentUserId, keyword, getmuteWordList(currentUserId),shareRange);
        }catch(Exception e){
            log.error("キーワード検索投稿の取得に失敗しました。", e);
            throw new RuntimeException("キーワード検索投稿の取得に失敗しました。", e);
        }
        for(PostDetailResponse postDetail : postDetails){
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }
        return postDetails;
    }

    // 投稿削除
    @Override
    public void deletePost(String postId, Integer userId) {

        // 1) 入力チェック
        if (postId == null || postId.isBlank()) {
            throw new IllegalArgumentException("投稿IDが無効です。");
        }   
        if (userId == null) {
            throw new IllegalArgumentException("ユーザーIDが無効です。");
        }

        // 2) ObjectIdに変換
        final ObjectId postObjectId;
        try {
            postObjectId = new ObjectId(postId);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("投稿IDの形式が不正です。", e);
        }

        // 3) 投稿取得
        PostEntity post = postRepository.findById(postObjectId)
                .orElseThrow(() -> new IllegalArgumentException("指定された投稿が存在しません。"));

        // 4)　ユーザーチェック
        if (!postRepository.existsByIdAndUserId(postObjectId, userId)) {
            throw new IllegalArgumentException("投稿の削除権限がありません。");
        }

        // 5) 画像キー取得
        List<String> fileObjectKeys = post.getImageObjectKey();

        try {
            // 6) 付随データ削除
            likeRepository.deleteByPostId(postObjectId);
            bookmarkRepository.deleteByPostId(postObjectId);

            // 7) ファイル削除
            if (fileObjectKeys != null && !fileObjectKeys.isEmpty()) {
                fileControlHelper.deleteFile(fileObjectKeys.toArray(new String[0]));
            }

            // 8) 投稿削除と返信のデクリメント
            if(  post.getResponseTo() != null){
                log.info("返信元投稿のresponse_countをデクリメントします。 投稿ID: {}", post.getResponseTo());
                long result = postRepository.decrementResponseCount(post.getResponseTo());
                if (result == 0) {
                    log.warn("返信元投稿のresponse_countのデクリメントに失敗しました。該当する投稿が見つかりません。 投稿ID:{} " , post.getResponseTo());
                    throw new RuntimeException("返信元投稿のresponse_countのデクリメントに失敗しました。該当する投稿が見つかりません。");
                } else {
                    log.info("返信元投稿のresponse_countを正常にデクリメントしました。 投稿ID: {}", post.getResponseTo());
                }
            }
            postRepository.deleteByIdAndUserId(postObjectId, userId);
            
            log.info("投稿の削除に成功しました。 投稿ID: {}", postId);

        } catch (Exception e) {
            log.error("投稿の削除に失敗しました。 投稿ID: {}", postId, e);
            throw new RuntimeException("投稿の削除に失敗しました。", e);
        }
    }

    //profileを実装のち実装
    private List<String> getmuteWordList(Integer userId) {
        List<String> muteWordList = List.of();
        return muteWordList;
    }
}