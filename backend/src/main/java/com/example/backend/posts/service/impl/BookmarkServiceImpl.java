package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.posts.service.BookmarkService;
import com.example.backend.posts.repository.BookmarkRepository;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.helper.PostPermissionHelper;
import org.springframework.security.core.Authentication;
import com.example.backend.posts.model.BookmarkEntity;
import com.example.backend.utils.accountConfirm.AccountConfirm;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import org.bson.types.ObjectId;
import java.util.Set;
import java.util.HashSet;
import java.util.Iterator;

import lombok.RequiredArgsConstructor;

import com.example.backend.posts.dto.PostDetailResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    private final FileControlHelper fileControlHelper;

    private final PostRepository postRepository;

    private final PostPermissionHelper postPermissionHelper;

    private final AccountConfirm accountConfirm;

    //投稿の存在確認
    private boolean existsPost(ObjectId postId) {
        return postRepository.existsById(postId);
    }

    //ブックマークの存在確認
    private boolean isBookmarked(Integer userId, ObjectId postId) {
        return bookmarkRepository.existsByUserIdAndPostId(userId, postId);
    }

    //ブックマークの追加
    @Override
    public void addBookmark(ObjectId postId, Integer userId) {
        BookmarkEntity bookmark = new BookmarkEntity();
        bookmark.setUserId(userId);
        bookmark.setPostId(postId);
        bookmark.setBookmarkedAt(Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant()));

        if (!existsPost(bookmark.getPostId())) {
            log.info("投稿が存在しません userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
            throw new RuntimeException("投稿が存在しません");
        }

        if (isBookmarked(bookmark.getUserId(), bookmark.getPostId())) {
            log.info("すでにブックマークされています userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
            throw new RuntimeException("すでにブックマークされています");
        }
        try{
        bookmarkRepository.save(bookmark);
        log.info("ブックマークが正常に追加されました userId: {} and postId: {}", bookmark.getUserId(), bookmark.getPostId());
        } catch(Exception e){
            log.error("ブックマークの追加に失敗しました userId: {} and postId: {} エラー: {}" , bookmark.getUserId(), bookmark.getPostId(), e);
            throw new RuntimeException("ブックマークの追加に失敗しました");
        }
    }

    //ブックマークの削除
    @Override
    public void removeBookmark(ObjectId postId, Integer userId) {

        if (!isBookmarked(userId, postId)) {
            log.info("ブックマークが存在しません userId: {} and postId: {}", userId, postId);
            throw new IllegalStateException("ブックマークが存在しません");
        }
        try{
        bookmarkRepository.deleteByUserIdAndPostId(userId, postId);
        log.info("ブックマークが正常に削除されました userId: {} and postId: {}", userId, postId);
        } catch(Exception e){
            log.error("ブックマークの削除に失敗しました userId: {} and postId: {} エラー: {}" , userId, postId, e);
            throw new RuntimeException("ブックマークの削除に失敗しました");
        }
    }

    //ブックマーク投稿の取得
    @Override
    public List<PostDetailResponse> getBookmarkedPosts(Authentication authentication, Integer userId, Integer schoolId) {
        List<PostDetailResponse> postDetails = List.of();
        HashSet<Integer> shareRangeList = new HashSet<>();
        boolean isAdminOrTeacher = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN_SCHOOL") || grantedAuthority.getAuthority().equals("ROLE_TEACHER"));
        try{
            postDetails = bookmarkRepository.findByBookmarked(userId);
        } catch(Exception e){
            log.error("ブックマーク投稿の取得に失敗しました userId: {} エラー: {}" , userId, e);
            throw new RuntimeException("ブックマーク投稿の取得に失敗しました");
        }

        Set<Integer> userGroups = null;
        if (!isAdminOrTeacher) {
            userGroups = new HashSet<>(postPermissionHelper.getUserGroupIds(userId));
            userGroups.add(0);
        }

        Iterator<PostDetailResponse> iterator = postDetails.iterator();
        try{
            while (iterator.hasNext()) {
                PostDetailResponse postDetail = iterator.next();

                // 一般ユーザー: 閲覧権限チェック
                if (!isAdminOrTeacher && userGroups != null) {
                    if (postDetail.getShareRange().stream().noneMatch(userGroups::contains)) {
                        iterator.remove();
                        continue;
                    }
                }
                // 管理者/教師: 学校の場合 shareRangeを集約
                if (isAdminOrTeacher && !postDetail.getShareRange().contains(0)) {
                    shareRangeList.addAll(postDetail.getShareRange());
                }


                postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
                postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            }

            // 管理者/教師: 学校に所属しない投稿があった場合はエラー
            if (isAdminOrTeacher && shareRangeList != null) {
                if(!accountConfirm.isAllGroupsBelongToSchool(schoolId, new ArrayList<>(shareRangeList))) {
                    throw new RuntimeException("学校に所属しないグループの投稿が含まれています、他校向けの投稿は表示できません");
                }
            }
        } catch(Exception e){
            log.error("ブックマーク投稿の処理中にエラーが発生しました userId: {} エラー: {}" , userId, e);
            throw new RuntimeException("ブックマーク投稿の処理中にエラーが発生しました");
        }

        log.info("ブックマーク投稿の取得に成功しました userId: {}", userId);
        return postDetails;
    }
}