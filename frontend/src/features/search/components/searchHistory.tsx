import { SearchBar } from "@/components/ui/search/search";
import { useState } from "react";
import { TiRefresh } from "react-icons/ti";
import styles from "./searchHistory.module.css";

const dummyHistory = [
  "むとうはるき かっこいい",
  "むとうはるき かわいい",
  "むとうはるき いけめん",
  "むとうはるき あたまいい",
  "むとうはるき 何者？",
];

export const SearchHistory = () => {
  const [query, setQuery] = useState<string>("");
  const [history, setHistory] = useState<string[]>(dummyHistory);

  const handleSearch = () => {
    if (!query.trim()) return;

    const newHistory = [query, ...history].slice(0, 5);
    setHistory(newHistory);
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
  };

  return (
    <div className={styles.searchContainer}>
      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
      />

      {history.length > 0 && (
        <ul className={styles.searchHistoryList}>
          {history.map((item, index) => (
            <li
              key={`${item}-${index}`}
              onClick={() => handleHistoryClick(item)}
              className={styles.searchHistoryItem}
            >
              <TiRefresh className={styles.searchHistoryIcon} />
              <span className={styles.searchHistoryText}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
