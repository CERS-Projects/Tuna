import { SearchBar } from "@/components/ui/search/search";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { TiRefresh } from "react-icons/ti";
import { FaRegTrashAlt } from "react-icons/fa";
import { PostBox } from "@/components/ui/postBox/postBox";
import styles from "./searchHistory.module.css";
import { useSearchPosts } from "../hooks/useSearchPosts";
import {
  useSearchHistory,
  useDeleteSearchHistory,
} from "../hooks/useSearchHistory";
import { Spinner } from "@/components/ui/spinner/spinner";

type Props = {
  selectedIds: Set<number>;
};

export const SearchHistory = ({ selectedIds }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [query, setQuery] = useState<string>(keyword);

  const {
    data: searchData = [],
    isFetching: isSearchFetching,
    isError: isSearchError,
  } = useSearchPosts(keyword, selectedIds);

  const { data: history = [] } = useSearchHistory();
  const { mutate: deleteHistoryMutate } = useDeleteSearchHistory();

  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(keyword);
  }, [keyword]);

  const updateSearchParams = (newKeyword: string) => {
    const shareRangeValue =
      [...selectedIds].length === 0 ? "0" : [...selectedIds].join(",");
    setSearchParams(
      { shareRange: shareRangeValue, keyword: newKeyword },
      { replace: true },
    );
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    updateSearchParams(query);
    setIsFocused(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleHistoryClick = (newQuery: string) => {
    if (!newQuery.trim()) return;
    setQuery(newQuery);
    updateSearchParams(newQuery);
    setIsFocused(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleDeleteHistory = (query: string, searchedAt: string) => {
    deleteHistoryMutate({ query, searchedAt });
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <div className={styles.searchBarWrapper}>
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={handleSearch}
            onFocus={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
              setIsFocused(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(() => {
                setIsFocused(false);
                blurTimeoutRef.current = null;
              }, 200);
            }}
          />
        </div>

        <div className={styles.searchHistoryWrapper}>
          {isFocused && (
            <ul
              className={styles.searchHistoryList}
              onMouseDown={(e) => e.preventDefault()}
            >
              <li className={styles.searchHistoryListInner}>
                {history.length > 0 ? (
                  history.map((item) => (
                    <div
                      key={item.searched_at}
                      className={styles.searchHistoryItem}
                    >
                      <div
                        className={styles.searchHistoryContent}
                        onClick={() => handleHistoryClick(item.query)}
                      >
                        <TiRefresh className={styles.searchHistoryIcon} />
                        <span className={styles.searchHistoryText}>
                          {item.query}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.searchHistoryDeleteButton}
                        onClick={() =>
                          handleDeleteHistory(item.query, item.searched_at)
                        }
                      >
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  ))
                ) : (
                  <li className={styles.searchHistoryEmpty}>
                    検索履歴がありません
                  </li>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>

      {isSearchError ? (
        <>投稿の取得に失敗しました</>
      ) : isSearchFetching ? (
        <Spinner />
      ) : searchData.length > 0 ? (
        <div className={styles.postsContainer}>
          {searchData.map((item) => (
            <PostBox key={item.postId} {...item} />
          ))}
        </div>
      ) : keyword ? (
        <>該当する投稿がありません</>
      ) : (
        <>投稿を検索してください</>
      )}
    </div>
  );
};
