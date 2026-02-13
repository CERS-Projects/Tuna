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
        List<PostDetailResponse> postDetails = null;
        Set<Integer> getShaRangeList = new HashSet<>();
        boolean isAdminorTeacher = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ADMIN_SCHOOL") || grantedAuthority.getAuthority().equals("ROLE_TEACHER"));
        try{
            postDetails = bookmarkRepository.findByBookmarked(userId);

            Iterator<PostDetailResponse> iterator = postDetails.iterator();
            while (iterator.hasNext()) {
                PostDetailResponse postDetail = iterator.next();
                if(!isAdminorTeacher){
                    if (!postPermissionHelper.canViewPost(userId, postDetail.getShareRange())) {
                        iterator.remove();
                        continue;
                    }
                }
                getShaRangeList.addAll(postDetail.getShareRange());
                postDetail.setImageUrl(fileControlHelper.getMultiFileUrl(postDetail.getImageUrl()));
                postDetail.setIcon(fileControlHelper.getFileUrl(postDetail.getIcon()));
            }
            if(isAdminorTeacher){
                if(!accountConfirm.isExistsAllGroups(schoolId, getShaRangeList.toArray(new Integer[0]))){
                    log.error("取得したブックマークに学校に所属していないグループが含まれています userId: {} and schoolId: {} groups: {}", userId, schoolId,getShaRangeList);
                    throw new RuntimeException("取得したブックマークに学校に所属していないグループが含まれています");
                }
            }

        } catch(Exception e) {
            log.error("ブックマーク投稿の取得に失敗しました userId: {} エラー: {}", userId, e);
            throw new RuntimeException("ブックマーク投稿の取得に失敗しました");
        }
        return postDetails;
    }
}