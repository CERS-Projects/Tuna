package com.example.backend.school.model;

import lombok.Getter;

/* 
 * 申請状態を管理するための列挙型(Enum)の定義
 * SchoolEntityにまとめたかったのですが、入らなかったため別ファイルで定義しています。
 */

@Getter
public enum ApprovalStatus {
    PENDING(0),
    APPROVED(1),
    REJECTED(2);

    private final int DBVALUE;
    
    private ApprovalStatus(int dbvalue) {
        this.DBVALUE = dbvalue;
    }
}
