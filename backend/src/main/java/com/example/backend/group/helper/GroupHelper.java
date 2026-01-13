package com.example.backend.group.helper;

import org.springframework.stereotype.Component;

import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GroupHelper {

    private final GroupRepository groupRepository;

    /* グループIDから参照先のGroupEntityを取得 */
    public GroupEntity findGroupEntityById(Integer propsUpperGroupId){
        /* debug_begin */
        System.out.println("取得テスト");
        /* end_debug */

        GroupEntity upperGroupId = (propsUpperGroupId != null) ? 
        groupRepository.findById(propsUpperGroupId).orElse(null) : null;
        
        /* debug_begin */
        System.out.println("テスト完了: upperGroupId =" + upperGroupId);
        /* end_debug */                                        
        return upperGroupId;
    }
}
