package com.example.backend.support.Service;

import java.util.List;
import com.example.backend.support.Model.HelpContentEntity;
import com.example.backend.support.Model.HelpCategoryEntity;

public interface HelpService {

    List<HelpCategoryEntity> findHelpCategories();

    List<HelpContentEntity> findHelpByCategoryId(Integer categoryId);

    void createHelpCategory(HelpCategoryEntity data);

    void createHelpContents(HelpContentEntity data);

    void deleteHelpCategory(Integer categoryId);

    void deleteHelpContents(Integer content);
}
