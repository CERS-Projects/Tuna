package com.example.backend.classroom.service.impl;

import com.example.backend.classroom.service.ClassroomService;

import org.springframework.stereotype.Service;

import com.example.backend.classroom.dto.CategoryItem;
import com.example.backend.classroom.dto.DocumentItem;
import com.example.backend.classroom.dto.DocumentsResponse;
import com.example.backend.classroom.dto.ClassroomInsertRequest;
import com.example.backend.classroom.dto.ClassroomUpdateRequest;
import com.example.backend.classroom.dto.ClassroomsResponse;
import com.example.backend.classroom.model.ClassroomEntity;
import com.example.backend.classroom.model.CategoryEntity;
import com.example.backend.classroom.model.DocumentEntity;
import com.example.backend.classroom.dto.ClassroomDetailResponse;
import com.example.backend.classroom.dto.CategoriesResponse;


import com.example.backend.classroom.repository.ClassroomRepository;
import com.example.backend.classroom.repository.CategoryRepository;
import com.example.backend.classroom.repository.DocumentRepository;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.utils.fileUtil.validation.FileNameSanitizer;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassroomServiceImpl implements ClassroomService {

    private final FileControlHelper fileControlHelper;

    private final ClassroomRepository classroomRepository;

    private final CategoryRepository categoryRepository;

    private final DocumentRepository documentRepository;

    private final UserRepository userRepository;

    private final FileNameSanitizer fileNameSanitizer;

    // ドキュメント保存先ディレクトリ
    private static final String DOCUMENT_DIRECTORY = "documents";

    // クラスルーム作成処理
    @Transactional
    @Override
    public void createClassroomWithCategoriesAndDocuments (ClassroomInsertRequest classroomInsertRequest, Integer schoolId, Integer teacherId) {
        ClassroomEntity classroomEntity = new ClassroomEntity();
        List<String> allUploadedKeys = new ArrayList<>();
        
        try {
            // クラスルームの基本情報を設定
            classroomEntity.setId(new ObjectId());
            classroomEntity.setSchoolId(schoolId);
            classroomEntity.setTeacherId(teacherId);
            classroomEntity.setRoomName(classroomInsertRequest.getRoomName());
            classroomEntity.setDescription(classroomInsertRequest.getDescription());
            classroomEntity.setLatestUpdate(Date.from(OffsetDateTime.now().toInstant()));
            classroomRepository.save(classroomEntity);

            // カテゴリーの情報を設定
            // カテゴリーが存在しない場合はスキップ
            if(classroomInsertRequest.getCategories() != null && !classroomInsertRequest.getCategories().isEmpty()) {
                
                List<CategoryItem> categoryItems = classroomInsertRequest.getCategories();
                for (CategoryItem categoryItem : categoryItems) {
                    CategoryEntity categoryEntity = new CategoryEntity();
                    categoryEntity.setId(new ObjectId());
                    categoryEntity.setClassroomId(classroomEntity.getId());
                    categoryEntity.setCategoryName(categoryItem.getCategoryName());
                    categoryEntity.setCreatedDate(Date.from(OffsetDateTime.now().toInstant()));
                    categoryRepository.save(categoryEntity);

                    // ドキュメントの情報を設定
                    // ドキュメントが存在しない場合はスキップ
                    if(categoryItem.getDocuments() == null || categoryItem.getDocuments().isEmpty()) {
                        continue;
                    }
                    List<DocumentItem> documentsItems = categoryItem.getDocuments();
                    for (DocumentItem documentsItem : documentsItems) {
                        DocumentEntity documentsEntity = new DocumentEntity();
                        documentsEntity.setId(new ObjectId());
                        documentsEntity.setClassroomCategoryId(categoryEntity.getId()); 
                        documentsEntity.setDocumentName(fileNameSanitizer.sanitizeOriginalName(documentsItem.getDocumentFile()));
                        
                        List<String> uploadedKeys = fileControlHelper.uploadFile(DOCUMENT_DIRECTORY, documentsItem.getDocumentFile());
                        allUploadedKeys.add(uploadedKeys.get(0));
                        
                        documentsEntity.setDocumentObjectKey(uploadedKeys.get(0));
                        
                        documentsEntity.setUploadDate(Date.from(OffsetDateTime.now().toInstant()));
                        documentRepository.save(documentsEntity);
                }
            }
        }
            log.info("クラスルームの作成に成功しました: classroomId={}", classroomEntity.getId());
        } catch (Exception e) {
            log.error("クラスルームの作成に失敗しました", e);
            // アップロードされたファイルを削除
            if(!allUploadedKeys.isEmpty()){
                deleteUploadedFiles(allUploadedKeys);
            }

            throw new RuntimeException("クラスルームの作成に失敗しました");
        }
    }

    // 学校IDに基づくクラスルーム一覧取得処理
    @Override
    public List<ClassroomsResponse> getClassroomsBySchoolId(Integer schoolId) {
        List<ClassroomEntity> classroomEntities = classroomRepository.findBySchoolId(schoolId);
        
        if (classroomEntities.isEmpty()) {
            return List.of();
        }
        
        //teacherIdを先に収集して一括取得
        List<Integer> teacherIds = classroomEntities.stream()
                .map(ClassroomEntity::getTeacherId)
                .distinct()
                .toList();
        
        //teacherIdでユーザーを一括取得
        Map<Integer, String> teacherNameMap = userRepository.findByUserIdIn(teacherIds)
                .stream()
                .collect(Collectors.toMap(
                        user -> user.userId(),
                        user -> user.name()
                ));
        log.info("教師情報の取得に成功しました: teacherIds={}, teacherNameMap={}", teacherIds, teacherNameMap);

        return classroomEntities.stream().map(classroomEntity -> {
            ClassroomsResponse response = new ClassroomsResponse();
            response.setRoomId(classroomEntity.getId().toHexString());
            response.setRoomName(classroomEntity.getRoomName());
            response.setTeacherName(teacherNameMap.getOrDefault(classroomEntity.getTeacherId(), "不明な教師"));
            response.setDescription(classroomEntity.getDescription());
            response.setLatestUpdate(classroomEntity.getLatestUpdate());
            log.info("クラスルームの情報を取得しました: classroomId={}, teacherName={}", classroomEntity.getId(), response.getTeacherName());
            return response;
        }).toList();
    }

    //クラスルームの詳細取得処理
    @Override
    public ClassroomDetailResponse getClassroomDetails(String roomId, Integer schoolId) {
        ClassroomDetailResponse response;

        try {
            if (!classroomRepository.existsByIdAndSchoolId(new ObjectId(roomId), schoolId)) {
                throw new RuntimeException("クラスルームが見つからないか、学校に所属していません");
            }
            response = classroomRepository.findClassroomWithCategoriesAndDocumentsById(new ObjectId(roomId));
            
            for (CategoriesResponse category : response.getCategories()) {
                for (DocumentsResponse document : category.getDocuments()) {
                    String presignedUrl = fileControlHelper.getFileUrl(document.getDocumentUrl());
                    document.setDocumentUrl(presignedUrl);
                }
            }
        }catch(Exception e) {
            log.error("クラスルームの詳細取得に失敗しました", e);
            throw new RuntimeException("クラスルームの詳細取得に失敗しました");
        }
        return response;
    }


    // クラスルーム更新処理
    @Transactional
    @Override
    public void updateClassroom(ClassroomUpdateRequest classroomUpdateRequest, Integer schoolId) {
        List<String> uploadedFileKeys = new ArrayList<>();
        
        try {
            ClassroomEntity classroomEntity = classroomRepository.findById(new ObjectId(classroomUpdateRequest.getRoomId()))
                    .orElseThrow(() -> new RuntimeException("クラスルームが見つかりません"));

            if(!classroomRepository.existsByIdAndSchoolId(new ObjectId(classroomUpdateRequest.getRoomId()), schoolId)) {
                log.error("クラスルームが見つからないか、学校に所属していません: roomId={}, schoolId={}", 
                    classroomUpdateRequest.getRoomId(), schoolId);
                throw new RuntimeException("クラスルームが見つからないか、学校に所属していません");
            }

            classroomEntity.setRoomName(classroomUpdateRequest.getRoomName());
            classroomEntity.setDescription(classroomUpdateRequest.getDescription());
            classroomEntity.setLatestUpdate(Date.from(OffsetDateTime.now().toInstant()));
            classroomRepository.save(classroomEntity);
            log.info("クラスルームの更新に成功しました: roomId={}", classroomUpdateRequest.getRoomId());

            // 新しいカテゴリーの追加処理
            if(classroomUpdateRequest.getNewCategories() != null && !classroomUpdateRequest.getNewCategories().isEmpty()){
                for (CategoryItem newCategory : classroomUpdateRequest.getNewCategories()) {
                    CategoryEntity categoryEntity = new CategoryEntity();
                    categoryEntity.setId(new ObjectId());
                    categoryEntity.setClassroomId(classroomEntity.getId());
                    categoryEntity.setCategoryName(newCategory.getCategoryName());
                    categoryEntity.setCreatedDate(Date.from(OffsetDateTime.now().toInstant()));
                    categoryRepository.save(categoryEntity);

                    // 新しいドキュメントファイルの追加
                    if(newCategory.getDocuments() != null && !newCategory.getDocuments().isEmpty()) {
                        for (DocumentItem documentItem : newCategory.getDocuments()) {
                            DocumentEntity documentEntity = new DocumentEntity();
                            documentEntity.setId(new ObjectId());
                            documentEntity.setClassroomCategoryId(categoryEntity.getId());
                            documentEntity.setDocumentName(fileNameSanitizer.sanitizeOriginalName(documentItem.getDocumentFile()));
                            
                            List<String> uploadedKeys = fileControlHelper.uploadFile(DOCUMENT_DIRECTORY, documentItem.getDocumentFile());
                            String fileKey = uploadedKeys.get(0);
                            documentEntity.setDocumentObjectKey(fileKey);
                            uploadedFileKeys.add(fileKey);
                            
                            documentEntity.setUploadDate(Date.from(OffsetDateTime.now().toInstant()));
                            documentRepository.save(documentEntity);
                            log.info("新しいドキュメントの追加に成功しました: documentId={}", documentEntity.getId());
                        }
                    }
                    log.info("新しいカテゴリーの追加に成功しました: categoryId={}", categoryEntity.getId());
                }
            }

            // カテゴリーの更新処理
            if(classroomUpdateRequest.getUpdateCategories() != null && !classroomUpdateRequest.getUpdateCategories().isEmpty()) {
                for (ClassroomUpdateRequest.CategoryEditItem categoryEditItem : classroomUpdateRequest.getUpdateCategories()) {
                    CategoryEntity categoryEntity = categoryRepository.findById(new ObjectId(categoryEditItem.getCategoryId()))
                            .orElseThrow(() -> new RuntimeException("カテゴリーが見つかりません: categoryId=" + categoryEditItem.getCategoryId()));
                    categoryEntity.setCategoryName(categoryEditItem.getCategoryName());
                    categoryRepository.save(categoryEntity);
                    log.info("カテゴリーの更新に成功しました: categoryId={}", categoryEditItem.getCategoryId());

                    // 新しいドキュメントファイルの追加
                    if(categoryEditItem.getNewDocumentFiles() != null && !categoryEditItem.getNewDocumentFiles().isEmpty()) {
                        for (MultipartFile newDocumentFile : categoryEditItem.getNewDocumentFiles()) {
                            DocumentEntity documentEntity = new DocumentEntity();
                            documentEntity.setId(new ObjectId());
                            documentEntity.setClassroomCategoryId(categoryEntity.getId());
                            documentEntity.setDocumentName(fileNameSanitizer.sanitizeOriginalName(newDocumentFile));
                            
                            List<String> uploadedKeys = fileControlHelper.uploadFile(DOCUMENT_DIRECTORY, newDocumentFile);
                            String fileKey = uploadedKeys.get(0);
                            documentEntity.setDocumentObjectKey(fileKey);
                            uploadedFileKeys.add(fileKey);
                            
                            documentEntity.setUploadDate(Date.from(OffsetDateTime.now().toInstant()));
                            documentRepository.save(documentEntity);
                            log.info("新しいドキュメントの追加に成功しました: documentId={}", documentEntity.getId());
                        }
                    }else {
                        log.info("追加するドキュメントはありません: categoryId={}", categoryEditItem.getCategoryId());
                    }
                    

                    // ドキュメントの削除
                    if(categoryEditItem.getDeleteDocumentIds() != null && !categoryEditItem.getDeleteDocumentIds().isEmpty()) {
                        for (String deleteDocumentId : categoryEditItem.getDeleteDocumentIds()) {
                            DocumentEntity documentEntity = documentRepository.findById(new ObjectId(deleteDocumentId))
                                    .orElseThrow(() -> new RuntimeException("ドキュメントが見つかりません: documentId=" + deleteDocumentId));
                            fileControlHelper.deleteFile(documentEntity.getDocumentObjectKey());
                            log.info("ドキュメントファイルの削除に成功しました: documentId={}", deleteDocumentId);

                            documentRepository.deleteById(documentEntity.getId());
                            log.info("ドキュメント情報の削除に成功しました: documentId={}", deleteDocumentId);
                        }
                    }
                }
            }

            // カテゴリーの削除
            if(classroomUpdateRequest.getDeleteCategoryIds() != null && !classroomUpdateRequest.getDeleteCategoryIds().isEmpty()){  // 修正
                for (String deleteCategoryId : classroomUpdateRequest.getDeleteCategoryIds()) {
                    CategoryEntity categoryEntity = categoryRepository.findById(new ObjectId(deleteCategoryId))
                            .orElseThrow(() -> new RuntimeException("カテゴリーが見つかりません: categoryId=" + deleteCategoryId));
                    
                    List<DocumentEntity> documentsToDelete = documentRepository.findByClassroomCategoryId(categoryEntity.getId());
                    for (DocumentEntity documentEntity : documentsToDelete) {
                        fileControlHelper.deleteFile(documentEntity.getDocumentObjectKey());
                        log.info("ドキュメントファイルの削除に成功しました: documentId={}", documentEntity.getId());
                        documentRepository.deleteById(documentEntity.getId());
                        log.info("ドキュメント情報の削除に成功しました: documentId={}", documentEntity.getId());
                    }
                    categoryRepository.deleteById(categoryEntity.getId());
                    log.info("カテゴリー情報の削除に成功しました: categoryId={}", deleteCategoryId);
                }
            }
            
        } catch(Exception e) {
            log.error("クラスルームの更新に失敗しました: roomId={}", classroomUpdateRequest.getRoomId(), e);
            // エラー時にアップロード済みファイルを削除
            if(!uploadedFileKeys.isEmpty()) {
                deleteUploadedFiles(uploadedFileKeys);
            }
            throw new RuntimeException("クラスルームの更新に失敗しました");
        }
    }
    // クラスルーム削除処理
    @Transactional
    @Override
    public void deleteClassroom(String roomId, Integer schoolId) {
        if(!classroomRepository.existsByIdAndSchoolId(new ObjectId(roomId), schoolId)) {
            log.error("クラスルームが見つからないか、学校に所属していません: roomId={}, schoolId={}", roomId, schoolId);
            throw new RuntimeException("クラスルームが見つからないか、学校に所属していません");
        }
        try {
            List<CategoryEntity> deleteCategories = categoryRepository.findByClassroomId(new ObjectId(roomId));
            for (CategoryEntity deleteCategory : deleteCategories) {
                List<DocumentEntity> deleteDocuments = documentRepository.findByClassroomCategoryId(deleteCategory.getId());
                for (DocumentEntity document : deleteDocuments) {
                    fileControlHelper.deleteFile(document.getDocumentObjectKey());
                    log.info("関連するドキュメントの削除に成功しました: documentId={}", document.getId());
                    documentRepository.deleteById(document.getId());
                    log.info("関連するドキュメント情報の削除に成功しました: documentId={}", document.getId());
                }  // ← documentのfor終了
                categoryRepository.deleteById(deleteCategory.getId());
                log.info("関連するカテゴリー情報の削除に成功しました: categoryId={}", deleteCategory.getId());
            }  // ← deleteCategoryのfor終了
            classroomRepository.deleteById(new ObjectId(roomId));
            log.info("クラスルームの削除に成功しました: roomId={}", roomId);
        } catch (Exception e) {
            log.error("クラスルームの削除に失敗しました: roomId={}", roomId, e);
            throw new RuntimeException("クラスルームの削除に失敗しました");
        }
    }

    // アップロードされたファイルを削除するメソッド
    private void deleteUploadedFiles(List<String> fileKeys) {
        for (String fileKey : fileKeys) {
            try {
                fileControlHelper.deleteFile(fileKey);
                log.info("アップロードされたファイルの削除に成功しました: fileKey={}", fileKey);
            } catch (Exception e) {
                log.error("アップロードされたファイルの削除に失敗しました: fileKey={}", fileKey, e);
            }
        }
    }
}
