import { useState, type KeyboardEvent } from "react";
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
  const [errorMessage, setErrorMessage] = useState<string>("");

  const maxLength = 20;

  const isInvalidInput =
    inputWord.trim().length === 0 || inputWord.length > maxLength;

  const handleAddWord = () => {
    const trimmedInput = inputWord.trim();

    if (!trimmedInput) return;

    const isDuplicate = filterWords.some((item) => item.word === trimmedInput);
    if (isDuplicate) {
      setErrorMessage(`「${trimmedInput}」は既に追加されています`);
      return;
    }

    const newFilterWord: FilterWord = { word: trimmedInput };
    setFilterWords([newFilterWord, ...filterWords]);

    setInputWord("");
    setErrorMessage("");
  };

  const handleRemoveWord = (wordToRemove: string) => {
    const newWords = filterWords.filter((item) => item.word !== wordToRemove);
    setFilterWords(newWords);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !isInvalidInput) {
      e.preventDefault();
      handleAddWord();
    }
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
                    inputWord.length > maxLength ? styles.charCountLimit : ""
                  }`}
                >
                  {inputWord.length} / {maxLength}
                </span>
              </div>
              <input
                id="filterWord"
                type="text"
                className={`${styles.input} ${errorMessage ? styles.inputError : ""}`}
                placeholder="例: ネタバレ"
                value={inputWord}
                onChange={(e) => {
                  setInputWord(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                onKeyDown={handleKeyDown}
              />
              {errorMessage && (
                <p
                  className={styles.errorMessage}
                  style={{ color: "red", fontSize: "0.8rem", marginTop: "4px" }}
                >
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={handleAddWord}
              disabled={isInvalidInput}
              style={{
                opacity: isInvalidInput ? 0.5 : 1,
                cursor: isInvalidInput ? "not-allowed" : "pointer",
              }}
            >
              追加する
            </button>
          </div>

          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              登録済みのワード ({filterWords.length})
            </div>
            <ul className={styles.wordList}>
              {filterWords.map((wordObj) => (
                <li key={wordObj.word} className={styles.wordItem}>
                  <span className={styles.wordText}>{wordObj.word}</span>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleRemoveWord(wordObj.word)}
                    aria-label={`${wordObj.word}を削除`}
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
