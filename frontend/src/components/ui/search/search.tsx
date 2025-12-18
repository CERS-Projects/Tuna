import { FaSearch } from "react-icons/fa";
import styles from "./search.module.css";
import type React from "react";

type HistoryProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export const SearchBar = ({ value, onChange, onSearch }: HistoryProps) => {
  return (
    <div className={styles.searchContainer}>
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder="検索"
        className={styles.searchInput}
      />
      <FaSearch onClick={onSearch} className={styles.searchIcon} />
    </div>
  );
};
