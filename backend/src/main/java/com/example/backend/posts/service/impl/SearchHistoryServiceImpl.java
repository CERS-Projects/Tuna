package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.posts.service.SearchHistoryService;


import com.example.backend.posts.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.posts.model.SearchHistoryEntity;
import com.example.backend.posts.model.SearchHistoryItem;
import com.mongodb.client.result.UpdateResult;
import java.util.Date;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.bson.types.ObjectId;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class SearchHistoryServiceImpl  implements SearchHistoryService {

    private final SearchHistoryRepository historyRepository;

    private final int MAX_HISTORY_SIZE = 20;

    //履歴を追加する
    @Transactional
    @Override
    public void addSearchHistory(Integer userId, String query) {
        SearchHistoryItem newItem = new SearchHistoryItem();
        
        newItem.setQuery(query);
        newItem.setSearched_at(Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant()));
        log.info("検索履歴の追加を開始しました。 userId: " + userId + ", query: " + query);
        SearchHistoryEntity userHistory = historyRepository.findByUserId(userId);

        if (userHistory == null) {
            // 新しいユーザーの履歴を作成
            SearchHistoryEntity newHistory = new SearchHistoryEntity();
            newHistory.setUserId(userId);
            List<SearchHistoryItem> historyList = new ArrayList<>();
            historyList.add(newItem);
            newHistory.setSearchHistory(historyList);
            historyRepository.save(newHistory);
            log.info("検索履歴の新規作成に成功しました。 userId: " + userId + ", query: " + query);
        } else {
            // 既存の履歴に追加
            userHistory.getSearchHistory().add(newItem);
            if (userHistory.getSearchHistory().size() >= MAX_HISTORY_SIZE) {
                // 古い履歴を削除
                userHistory.getSearchHistory().remove(0);

            }
            log.info("検索履歴の追加に成功しました。 userId: " + userId + ", query: " + query);
            historyRepository.save(userHistory);
        }
    }

    @Transactional
    @Override
    public List<SearchHistoryItem> getSearchHistory(Integer userId) {

        SearchHistoryEntity history = historyRepository.findByUserId(userId);
        List<SearchHistoryItem> historyList = history != null ? history.getSearchHistory() : new ArrayList<>();
        return historyList;
    }

    @Transactional
    @Override
    public void removeSearchHistory(Integer userId, String keyword) {

        SearchHistoryEntity entity = historyRepository.findByUserId(userId);
        if (entity == null){
            log.info("検索履歴の削除に失敗しました。 userId: " + userId + "の検索履歴は存在しません。");
            throw new IllegalArgumentException("指定されたユーザーの検索履歴は存在しません。");
        };

        List<SearchHistoryItem> list = entity.getSearchHistory();
        if (list == null || list.isEmpty()){
            log.info("検索履歴の削除に失敗しました。 userId: " + userId + "の検索履歴は空です。");
            throw new IllegalArgumentException("指定されたユーザーの検索履歴は空です。");
        }

        for (int i = list.size() - 1; i >= 0; i--) {
            if (keyword.equals(list.get(i).getQuery())) {
                list.remove(i);
                break; // ← 1件だけ削除
            }
        }
        log.info("検索履歴の削除に成功しました。 userId: " + userId + ", keyword: " + keyword);
        historyRepository.save(entity);
        log.info("検索履歴の保存に成功しました。 userId: " + userId + ", keyword: " + keyword);
    }
}
