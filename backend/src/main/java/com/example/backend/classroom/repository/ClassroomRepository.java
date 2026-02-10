package com.example.backend.classroom.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.classroom.dto.ClassroomDetailResponse;
import com.example.backend.classroom.model.ClassroomEntity;
import org.springframework.data.mongodb.repository.Aggregation;
import org.bson.types.ObjectId;
import java.util.List;

@Repository
public interface ClassroomRepository extends MongoRepository<ClassroomEntity, ObjectId> {  

    List<ClassroomEntity> findBySchoolId(Integer schoolId);

    //クラスルームの学校に所属しているか確認する関数
    boolean existsByIdAndSchoolId(ObjectId classroomId, Integer schoolId);

    @Aggregation(pipeline = {
        "{ $match: { _id: ?0 } }",
        
        // カテゴリーを結合
        "{ $lookup: { " +
            "from: 'classroom_category_collection', " +
            "localField: '_id', " +
            "foreignField: 'classroom_id', " +
            "as: 'categories' " +
        "} }",
        
        // カテゴリーを展開
        "{ $unwind: { " +
            "path: '$categories', " +
            "preserveNullAndEmptyArrays: true " +
        "} }",
        "filter: { 'categories': { $ne: null } }",
        
        // 各カテゴリーにドキュメントを結合
        "{ $lookup: { " +
            "from: 'classroom_document_collection', " +
            "localField: 'categories._id', " +
            "foreignField: 'classroom_category_id', " +
            "as: 'categories.documents' " +
        "} }",
        
        // ドキュメントのフィールド名をDTOに合わせる
        "{ $addFields: { " +
            "'categories.documents': { " +
                "$map: { " +
                    "input: '$categories.documents', " +
                    "as: 'doc', " +
                    "in: { " +
                        "documentName: '$$doc.document_name', " +
                        "documentUrl: '$$doc.document_objectKey', " +
                        "uploadedAt: '$$doc.upload_date' " +
                    "} " +
                "} " +
            "} " +
        "} }",
        
        // カテゴリーごとに再集約
        "{ $group: { " +
            "_id: '$_id', " +
            "room_name: { $first: '$room_name' }, " +
            "description: { $first: '$description' }, " +
            "categories: { $push: '$categories' } " +
        "} }",
        
        // DTOのフィールド名に合わせて整形
        "{ $project: { " +
            "_id: 0, " +
            "roomName: '$room_name', " +
            "description: 1, " +
            "categories: { " +
                "$map: { " +
                    "input: '$categories', " +
                    "as: 'cat', " +
                    "in: { " +
                        "categoryName: '$$cat.categoryname', " +
                        "documents: '$$cat.documents', " +
                        "createdAt: '$$cat.created_date' " +
                    "} " +
                "} " +
            "} " +
        "} }"
    })
    ClassroomDetailResponse findClassroomWithCategoriesAndDocumentsById(ObjectId classroomId);
}