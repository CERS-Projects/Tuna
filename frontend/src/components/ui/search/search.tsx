import { FaSearch } from "react-icons/fa";
import styles from "./search.module.css";
import type React from "react";

type HistoryProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
}: HistoryProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") {
      onSearch();
    }
  };
  return (
    <div className={styles.searchContainer}>
      <input
        value={value}
        onChange={onChange}
        type="text"
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="検索"
        className={styles.searchInput}
      />
      <button
        type="button"
        onClick={onSearch}
        className={styles.searchIcon}
        aria-label="検索"
      >
        <FaSearch />
      </button>
    </div>
  );
};
