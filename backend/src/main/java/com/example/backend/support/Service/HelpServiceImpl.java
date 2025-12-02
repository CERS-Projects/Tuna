package com.example.backend.support.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.support.Model.HelpContentEntity;
import com.example.backend.support.Model.HelpCategoryEntity;
import com.example.backend.support.Repositry.HelpContentRepository;
import com.example.backend.support.Repositry.HelpCategoryRepository;

@Service
@Transactional
public class HelpServiceImpl implements HelpService {

    @Autowired
    private HelpCategoryRepository helpCategoryRepository;
    @Autowired
    private HelpContentRepository helpContentRepository;

    @Override
    public List<HelpCategoryEntity> findHelpCategories() {
        return helpCategoryRepository.findAll();
    }

    @Override
    public List<HelpContentEntity> findHelpByCategoryId(Integer id) {

        if (id == null) {
            throw new IllegalArgumentException("検索文字列が無効です");
        }

        if (helpContentRepository.existsById(id) == false) {
            throw new EmptyResultDataAccessException("見つかりません", 0);
        }
        return helpContentRepository.findByCategoryId(id);
    }

    @Override
    public void createHelpCategory(HelpCategoryEntity data) {

        if (data.getCategoryName() == null) {
            throw new IllegalArgumentException("保存データがnullです。");
        }

        try {
            helpCategoryRepository.save(data);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("カテゴリの作成に失敗しました");
        }

    }

    @Override
    public void createHelpContents(HelpContentEntity data) {

        if (data.getCategoryId() == null)
            throw new IllegalArgumentException("保存データがnullです");

        if (data.getQuestion() == null)
            throw new IllegalArgumentException("保存データがnullです");

        if (data.getAnswer() == null)
            throw new IllegalArgumentException("保存データがnullです");

        try {
            helpContentRepository.save(data);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("コンテンツの作成に失敗しました");
        }

    }

    @Override
    public void deleteHelpCategory(Integer categoryId) {

        if (categoryId == null)
            throw new IllegalArgumentException("削除IDがnullです");
        if (helpContentRepository.existsByCategoryId(categoryId) == true)
            throw new DataIntegrityViolationException("コンテンツが存在するため、削除できません");

        if (helpCategoryRepository.existsByCategoryId(categoryId)) {

            try {
                helpCategoryRepository.deleteById(categoryId);
            } catch (DataIntegrityViolationException e) {
                throw new DataIntegrityViolationException("カテゴリの削除に失敗しました");
            }

        } else {
            throw new EmptyResultDataAccessException("削除項目が存在しません", 0);
        }

    }

    @Override
    public void deleteHelpContents(Integer contentId) {

        if (contentId == null)
            throw new IllegalArgumentException("削除IDがnullです");

        if (helpContentRepository.existsByContentId(contentId)) {
            helpContentRepository.deleteById(contentId);
        } else {
            throw new EmptyResultDataAccessException("削除項目が存在しません", 0);
        }

        helpContentRepository.deleteById(contentId);

    }

}
