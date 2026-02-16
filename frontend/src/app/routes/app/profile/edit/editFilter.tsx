import { useState, type KeyboardEvent } from "react";
import styles from "@/features/profile/styles/editFilter.module.css";
import { useFilterWords } from "@/features/profile/hooks/useFilterWords";
import { useUpdateFilterWords } from "@/features/profile/hooks/useUpdateFilterWords";
import { Spinner } from "@/components/ui/spinner/spinner";

const EditFilter = () => {
  const { data, isPending: isWordsPending } = useFilterWords();
  const { mutate, isPending: isUpdating } = useUpdateFilterWords();

  const filterWordsList = data?.filterWords ?? [];

  const [inputWord, setInputWord] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const maxLength = 20;

  const isInvalidInput =
    inputWord.trim().length === 0 || inputWord.length > maxLength;

  const handleAddWord = () => {
    const trimmedInput = inputWord.trim();

    if (!trimmedInput) return;

    const isDuplicate = filterWordsList.some((item) => item === trimmedInput);
    if (isDuplicate) {
      setErrorMessage(`「${trimmedInput}」は既に追加されています`);
      return;
    }

    const newFilterWord: string = trimmedInput;

    mutate(
      { filterWords: [newFilterWord, ...filterWordsList] },
      {
        onSuccess: () => {
          setInputWord("");
          setErrorMessage("");
        },
        onError: () => {
          alert("フィルターワードの更新に失敗しました。");
        },
      },
    );
  };

  const handleRemoveWord = (wordToRemove: string) => {
    const newWords = filterWordsList.filter((item) => item !== wordToRemove);

    mutate(
      { filterWords: newWords },
      {
        onSuccess: () => {
          setInputWord("");
          setErrorMessage("");
        },
        onError: () => {
          alert("フィルターワードの更新に失敗しました。");
        },
      },
    );
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
                disabled={isUpdating}
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
              disabled={isInvalidInput || isUpdating}
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
              登録済みのワード ({filterWordsList.length})
            </div>
            <ul className={styles.wordList}>
              {isWordsPending ? (
                <Spinner />
              ) : filterWordsList.length > 0 ? (
                filterWordsList.map((wordObj) => (
                  <li key={wordObj} className={styles.wordItem}>
                    <span className={styles.wordText}>{wordObj}</span>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleRemoveWord(wordObj)}
                      aria-label={`${wordObj}を削除`}
                      disabled={isUpdating}
                    >
                      ✕
                    </button>
                  </li>
                ))
              ) : (
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
