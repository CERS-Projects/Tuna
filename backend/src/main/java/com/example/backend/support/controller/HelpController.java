package com.example.backend.support.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.support.model.HelpContentEntity;
import com.example.backend.support.model.HelpCategoryEntity;
import com.example.backend.support.service.HelpService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/support/help")
public class HelpController {

    private final HelpService helpService;

    @GetMapping("/category")
    public List<HelpCategoryEntity> getHelpCategory() {
        return helpService.findHelpCategories();
    }

    @GetMapping("/category/{categoryId}")
    public List<HelpContentEntity> getHelpContents(@PathVariable Integer categoryId) {
        return helpService.findHelpByCategoryId(categoryId);
    }

    @PostMapping("/category")
    public void insertHelpCategory(@RequestBody HelpCategoryEntity helpListEntity) {

        helpService.createHelpCategory(helpListEntity);
    }

    @PostMapping("/content")
    public void insertHelpContents(@RequestBody HelpContentEntity helpContentEntity) {
        helpService.createHelpContents(helpContentEntity);
    }

    @DeleteMapping("/category/{categoryId}")
    public void deleteHelpCategory(@PathVariable Integer categoryId) {
        helpService.deleteHelpCategory(categoryId);
    }

    @DeleteMapping("/content/{contentId}")
    public void deleteHelpContents(@PathVariable Integer contentId) {
        helpService.deleteHelpContents(contentId);
    }

}
