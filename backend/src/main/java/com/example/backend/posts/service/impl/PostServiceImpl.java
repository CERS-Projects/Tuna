package com.example.backend.posts.service.impl;

import com.example.backend.posts.model.PostEntity;
import com.example.backend.profile.model.UserProfileEntity;
import com.example.backend.posts.dto.PostInsertRequest;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.posts.dto.PostDetailResponse;
import org.bson.types.ObjectId;

import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.repository.LikeRepository;
import com.example.backend.posts.repository.BookmarkRepository;
import com.example.backend.utils.accountConfirm.AccountConfirm;
import com.example.backend.utils.accountConfirm.GroupJoinByUserId;

import com.example.backend.posts.service.PostService;
import com.example.backend.profile.repository.ProfileRepository;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.posts.helper.PostPermissionHelper;

import org.springframework.security.core.Authentication;
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

    private final PostPermissionHelper postPermissionHelper;

    private final ProfileRepository profileRepository;

    // 投稿作成
    @Override
    public void insertPost(Authentication authentication, PostInsertRequest post, Integer userId, Integer schoolId) {
        PostEntity postEntity = new PostEntity();
        List<String> fileObjectKeys = null;
        List<MultipartFile> imageFiles = post.getImageFile();
        ObjectId replyPost = null;

        // 返信投稿設定
        if (post.getResponseTo() != null && !post.getResponseTo().isEmpty()) {
            replyPost = new ObjectId(post.getResponseTo());
            log.info("返信：{}", postRepository.existsById(replyPost));
            if (post.getShareRange().contains(0)) {
                post.setShareRange(post.getShareRange().stream()
                        .filter(i -> i == 0)
                        .toList());
            }
        }
        log.info("投稿範囲 {}", post.getShareRange());

        // publicの0を除外
        List<Integer> userGroupIds = post.getShareRange().stream()
                .filter(i -> i != 0)
                .toList();
        // 除外したリストをもとに権限確認（userGroupIdsが空でない場合のみ)
        if (!userGroupIds.isEmpty()) {
            boolean isTeacherOrAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER")
                            || a.getAuthority().equals("ROLE_ADMIN_SCHOOL"));

            if (!isTeacherOrAdmin) {
                if (!accountConfirm.isExistsAllGroups(userId, userGroupIds.toArray(new Integer[0]))) {
                    throw new IllegalArgumentException("指定されたグループに所属していません。");
                }
            }

            // 教師/管理者でも指定グループが自校のものか検証
            if (isTeacherOrAdmin) {
                if (!accountConfirm.isAllGroupsBelongToSchool(schoolId, userGroupIds)) {
                    throw new IllegalArgumentException("指定されたグループは自校に属していません。");
                }
            }
        }

        if (imageFiles != null) {
            fileObjectKeys = fileControlHelper.uploadFile("images", imageFiles.toArray(new MultipartFile[0]));
            log.info("ファイルアップロード成功: {}", String.join(", ", fileObjectKeys));

        }
        // 返信投稿設定
        if (post.getResponseTo() != null && !post.getResponseTo().isEmpty()) {
            replyPost = new ObjectId(post.getResponseTo());
            log.info("返信：{}", postRepository.existsById(replyPost));
            if (post.getShareRange().contains(0)) {
                post.setShareRange(post.getShareRange().stream()
                        .filter(i -> i != 0)
                        .toList());
            }
        }

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        postEntity.setUserId(userId);
        postEntity.setSentence(post.getSentence());
        postEntity.setPostDate(Date.from(now.toInstant()));
        postEntity.setImageObjectKey(fileObjectKeys);
        postEntity.setShareRange(post.getShareRange());
        // 初期値はtrue
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
                    log.warn("返信元投稿のresponse_countのインクリメントに失敗しました。該当する投稿が見つかりません。 投稿ID:{} ", replyPost);
                    throw new RuntimeException("返信元投稿のresponse_countのインクリメントに失敗しました。該当する投稿が見つかりません。");
                } else {
                    log.info("返信元投稿のresponse_countを正常にインクリメントしました。 投稿ID: {}", replyPost);
                }
            }
        } catch (Exception e) {
            // ファイル削除
            log.info("投稿の保存に失敗したため、アップロードしたファイルを削除します。");
            if (fileObjectKeys != null) {
                fileControlHelper.deleteFile(fileObjectKeys.toArray(new String[0]));
            }
            log.error("投稿の保存に失敗しました。", e);
            throw new RuntimeException("投稿の保存に失敗しました。", e);
        }
    }

    // タイムライン取得
    @Override
    public List<PostDetailResponse> getTimelinePosts(Integer shareRange, Authentication authentication,
            UserInfo userInfo) {

        List<Integer> shareRangeList = new java.util.ArrayList<>(List.of(shareRange));

        boolean isTeacherOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER") || a.getAuthority().equals("ROLE_ADMIN_SCHOOL"));

        if (!isTeacherOrAdmin && !(shareRangeList.size() == 1 && shareRangeList.get(0) == 0)) {

            // publicのみ指定されている場合、全グループ参加確認は不要
            if (!accountConfirm.isExistsAllGroups(userInfo.getUserId(), shareRangeList.toArray(new Integer[0]))) {
                throw new IllegalArgumentException("指定されたグループに所属していません。");
            }

        }

        // 教師/管理者でも指定グループが自校のものか検証
        if (isTeacherOrAdmin && !(shareRangeList.size() == 1 && shareRangeList.get(0) == 0)) {
            if (!accountConfirm.isAllGroupsBelongToSchool(userInfo.getSchoolId(), shareRangeList)) {
                throw new IllegalArgumentException("指定されたグループは自校に属していません。");
            }
        }

        try {
            List<PostDetailResponse> postDetails = postRepository.findPostsWithDetails(
                    userInfo.getUserId(),
                    shareRangeList,
                    getmuteWordList(userInfo.getUserId()));

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

    // ユーザー投稿取得
    @Override
    public List<PostDetailResponse> getUserPosts(Authentication authentication, Integer targetUserId,
            Integer currentUserId, Integer schoolId) {
        List<PostDetailResponse> postDetails;
        List<Integer> userGroupIds = groupJoinByUserId.getJoinedGroupIdsByUserId(currentUserId);

        boolean isTeacherOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER") || a.getAuthority().equals("ROLE_ADMIN_SCHOOL"));
        if (!isTeacherOrAdmin) {
            if (!accountConfirm.isExistsAllGroups(currentUserId, userGroupIds.toArray(new Integer[0]))) {
                throw new IllegalArgumentException("指定されたグループに所属していません。");
            }
        } else {
            if (!accountConfirm.isAllGroupsBelongToSchool(schoolId, userGroupIds)) {
                throw new IllegalArgumentException("指定されたグループは自校に属していません。");
            }
        }
        userGroupIds.add(0); // public権限を追加

        try {
            log.info("取得を開始しました 相手targetUserId: " + targetUserId + " 取得 currentUserId: " + currentUserId);
            postDetails = postRepository.findUserPostsWithDetails(currentUserId, targetUserId, userGroupIds);
            log.info("取得完了しました。 投稿数: " + postDetails.size());
        } catch (Exception e) {

            log.error("ユーザー投稿の取得に失敗しました。", e.getMessage(), e);
            throw new RuntimeException("ユーザー投稿の取得に失敗しました。", e);
        }
        for (PostDetailResponse postDetail : postDetails) {
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
    }

    // 返信取得
    @Override
    public List<PostDetailResponse> getReplyPosts(String replyPostId, Integer currentUserId) {
        List<PostDetailResponse> postDetails;

        try {
            log.info("返信取得を開始しました 投稿ID: " + replyPostId + " 取得 currentUserId: " + currentUserId);
            postDetails = postRepository.findPostsResponseWithDetails(currentUserId, new ObjectId(replyPostId),
                    getmuteWordList(currentUserId));
        } catch (Exception e) {
            log.error("返信投稿の取得に失敗しました。", e);
            throw new RuntimeException("返信投稿の取得に失敗しました。", e);
        }
        for (PostDetailResponse postDetail : postDetails) {
            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
        }

        return postDetails;
    }

    // キーワード検索投稿取得
    @Override
    public List<PostDetailResponse> getPostsByKeyword(Authentication authentication, String keyword,
            UserInfo userInfo, List<Integer> shareRange) {
        List<PostDetailResponse> postDetails;
        Integer currentUserId = userInfo.getUserId();

        boolean isTeacherOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER") || a.getAuthority().equals("ROLE_ADMIN_SCHOOL"));

        // publicの0を除外
        List<Integer> nonPublicGroupIds = shareRange.stream()
                .filter(i -> i != 0)
                .toList();

        // 除外したリストをもとに権限確認（nonPublicGroupIdsが空でない場合のみ）
        if (!isTeacherOrAdmin && !nonPublicGroupIds.isEmpty()) {
            if (!accountConfirm.isExistsAllGroups(currentUserId, nonPublicGroupIds.toArray(new Integer[0]))) {
                throw new IllegalArgumentException("指定されたグループに所属していません。");
            }
        }

        // 教師/管理者でも指定グループが自校のものか検証
        if (isTeacherOrAdmin && !nonPublicGroupIds.isEmpty()) {
            if (!accountConfirm.isAllGroupsBelongToSchool(userInfo.getSchoolId(), nonPublicGroupIds)) {
                throw new IllegalArgumentException("指定されたグループは自校に属していません。");
            }
        }
        try {
            log.info("キーワード検索投稿取得を開始しました キーワード: " + keyword + " 取得 currentUserId: " + currentUserId);
            postDetails = postRepository.findPostsByKeywordWithDetails(currentUserId, keyword,
                    getmuteWordList(currentUserId), shareRange);
        } catch (Exception e) {
            log.error("キーワード検索投稿の取得に失敗しました。", e);
            throw new RuntimeException("キーワード検索投稿の取得に失敗しました。", e);
        }
        for (PostDetailResponse postDetail : postDetails) {
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

        // 4) ユーザーチェック
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
            if (post.getResponseTo() != null) {
                log.info("返信元投稿のresponse_countをデクリメントします。 投稿ID: {}", post.getResponseTo());
                long result = postRepository.decrementResponseCount(post.getResponseTo());
                if (result == 0) {
                    log.warn("返信元投稿のresponse_countのデクリメントに失敗しました。該当する投稿が見つかりません。 投稿ID:{} ", post.getResponseTo());
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

    // 投稿の単体取得
    @Override
    public PostDetailResponse getPostById(Authentication authentication, String postId, UserInfo userInfo) {
        PostDetailResponse postDetail;
        Integer currentUserId = userInfo.getUserId();

        boolean isTeacherOrAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER") || a.getAuthority().equals("ROLE_ADMIN_SCHOOL"));

        try {
            log.info("投稿単体取得を開始しました 投稿ID: " + postId + " 取得 currentUserId: " + currentUserId);

            postDetail = postRepository.findPostsWithDetail(
                    new ObjectId(postId),
                    currentUserId);

            if (postDetail == null) {
                log.error("指定された投稿が存在しません。 投稿ID: " + postId);
                throw new RuntimeException("指定された投稿が存在しません。");
            }
            // 投稿閲覧権限確認
            if (postDetail.getShareRange() != null && !postDetail.getShareRange().contains(0)) {

                if (isTeacherOrAdmin) {
                    // 教師/管理者は自校のグループの投稿のみ閲覧可能
                    if (!accountConfirm.isAllGroupsBelongToSchool(userInfo.getSchoolId(), postDetail.getShareRange())) {
                        log.error("投稿の閲覧権限がありません（他校の投稿）。 投稿ID: " + postId);
                        throw new IllegalArgumentException("投稿の閲覧権限がありません。");
                    }
                } else if (!postPermissionHelper.canViewPost(currentUserId, postDetail.getShareRange())) {
                    log.error("投稿の閲覧権限がありません。 投稿ID: " + postId);
                    throw new IllegalArgumentException("投稿の閲覧権限がありません。");
                }

            }
            log.info("取得完了しました。 投稿ID: " + postId);

            postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
            postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            return postDetail;

        } catch (Exception e) {
            log.error("投稿の取得に失敗しました。 投稿ID: " + postId, e);
            throw new RuntimeException("投稿の取得に失敗しました。", e);
        }
    }

    // ミュートワードリスト取得
    private List<String> getmuteWordList(Integer userId) {
        List<String> muteWordList;
        UserProfileEntity profile = profileRepository.getFilterWordsByUserId(userId)
                .orElse(null);

        if (profile == null || profile.getFilterWords() == null) {
            muteWordList = List.of();
        } else {
            muteWordList = profile.getFilterWords();
        }
        log.info("取得したミュートワードリスト: " + muteWordList);

        return muteWordList;
    }
}