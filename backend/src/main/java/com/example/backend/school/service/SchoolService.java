package com.example.backend.school.service;

import com.example.backend.school.dto.GetSchoolInformationRequest;
import com.example.backend.school.dto.GetSchoolInformationResponse;
import com.example.backend.school.dto.ModifySchoolInformationRequest;
import com.example.backend.school.dto.ModifySchoolInformationResponse;
import com.example.backend.school.dto.SchoolCreateRequest;

/*
 * このインターフェースは下記機能を提供する
 * ・学校情報の追加（学校登録時のみ使用想定）
 */
public interface SchoolService {
    Integer createSchool(SchoolCreateRequest dto);
    GetSchoolInformationResponse getSchoolInformation(GetSchoolInformationRequest dto);
    ModifySchoolInformationResponse modifySchoolInformation(ModifySchoolInformationRequest dto);
}
