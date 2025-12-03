package com.example.backend.support.service;

import java.util.List;
import com.example.backend.support.model.HelpContentEntity;
import com.example.backend.support.model.HelpCategoryEntity;

public interface HelpService {

    List<HelpCategoryEntity> findHelpCategories();

    List<HelpContentEntity> findHelpByCategoryId(Integer categoryId);

    void createHelpCategory(HelpCategoryEntity data);

    void createHelpContents(HelpContentEntity data);

    void deleteHelpCategory(Integer categoryId);

    void deleteHelpContents(Integer content);
}
