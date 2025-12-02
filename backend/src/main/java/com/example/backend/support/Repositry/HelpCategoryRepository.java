package com.example.backend.support.Repositry;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.support.Model.HelpCategoryEntity;

@Repository
public interface HelpCategoryRepository extends JpaRepository<HelpCategoryEntity, Integer>{
    Boolean existsByCategoryId(Integer categoryId);
}
