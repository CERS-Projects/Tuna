import { useState } from "react";
import styles from "@/features/profile/styles/editFilter.module.css";

type FilterWord = {
  word: string;
};

const dummyFilterWords: FilterWord[] = [
  { word: "test" },
  { word: "test2" },
  { word: "ああ" },
];

const EditFilter = () => {
  const [filterWords, setFilterWords] =
    useState<FilterWord[]>(dummyFilterWords);
  const [inputWord, setInputWord] = useState<string>("");

  const maxLength = 20;

  const handleAddWord = () => {
    const trimmedInput = inputWord.trim();
    if (!trimmedInput) return;

    const isDuplicate = filterWords.some((item) => item.word === trimmedInput);
    if (isDuplicate) {
      alert(`「${trimmedInput}」は既に追加されています。`);
      return;
    }
    if (trimmedInput.length > maxLength) {
      alert(`${maxLength}文字以内で入力してください。`);
      return;
    }

    const newFilterWord: FilterWord = { word: trimmedInput };
    setFilterWords([newFilterWord, ...filterWords]);
    setInputWord("");
  };

  const handleRemoveWord = (indexToRemove: number) => {
    const newWords = filterWords.filter((_, index) => index !== indexToRemove);
    setFilterWords(newWords);
  };

  return (
    <div className={styles.background}>
      <div className={styles.layoutFrame}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>フィルタリング設定</h2>
            <p className={styles.description}>
              特定の単語を含む投稿をタイムラインで非表示にします
            </p>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <div className={styles.labelContainer}>
                <label htmlFor="filterWord" className={styles.label}>
                  新しいワードを追加
                </label>
                <span
                  className={`${styles.charCount} ${
                    inputWord.length >= maxLength ? styles.charCountLimit : ""
                  }`}
                >
                  {inputWord.length} / {maxLength}
                </span>
              </div>
              <input
                id="filterWord"
                type="text"
                className={styles.input}
                placeholder="例: ネタバレ"
                value={inputWord}
                maxLength={20}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddWord();
                }}
              />
            </div>
            <button className={styles.addButton} onClick={handleAddWord}>
              追加する
            </button>
          </div>

          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              登録済みのワード ({filterWords.length})
            </div>
            <ul className={styles.wordList}>
              {filterWords.map((wordObj, index) => (
                <li key={index} className={styles.wordItem}>
                  <span className={styles.wordText}>{wordObj.word}</span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleRemoveWord(index)}
                    aria-label="削除"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {filterWords.length === 0 && (
                <li className={styles.emptyState}>
                  登録されているワードはありません
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFilter;
