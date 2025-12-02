package com.example.backend.support.Repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.support.Model.HelpContentEntity;

@Repository
public interface HelpContentRepository extends JpaRepository<HelpContentEntity, Integer> {
    List<HelpContentEntity> findByCategoryId(Integer categoryId);

    Boolean existsByContentId(Integer contentId);

    Boolean existsByCategoryId(Integer categoryId);
}
