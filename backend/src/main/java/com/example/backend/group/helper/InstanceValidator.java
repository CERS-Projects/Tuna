package com.example.backend.group.helper;

import java.io.Serializable;
import java.util.Objects;

/* 同じオブジェクト、同じ形なのか、DBの主キーにする関係で一意性を担保するためのクラス */
public class InstanceValidator implements Serializable{
    private Integer groupId;
    private Integer userId;

    public InstanceValidator(){}

    public InstanceValidator(Integer groupId, Integer userId){
        this.groupId = groupId;
        this.userId = userId;
    }

    @Override
    public int hashCode(){
        return Objects.hash(groupId, userId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        InstanceValidator that = (InstanceValidator) obj;
        return Objects.equals(groupId, that.groupId) && Objects.equals(userId, that.userId);
    }
}
