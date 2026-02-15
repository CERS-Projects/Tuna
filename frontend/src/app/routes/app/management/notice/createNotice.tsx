import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import styles from "@/features/notice/styles/createNotice.module.css";
import GroupSelector from "@/features/notice/components/groupSelector";
import { useGroups } from "@/features/management/hooks/useGroups";
import { useCreateNotice } from "@/features/notice/hooks/useCreateNotice";
import { paths } from "@/config/paths";

const CreateNotice = () => {
  const navigate = useNavigate();

  const { groups, isFetching } = useGroups();
  const { createNotice, isCreating } = useCreateNotice();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedGroupId) return;

    try {
      await createNotice({
        title,
        content,
        groupId: selectedGroupId,
      });
      alert("お知らせを作成しました");
      navigate(paths.app.management.notice.path);
    } catch (error) {
      alert("お知らせの作成に失敗しました");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル<span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            required
            placeholder="例：システムメンテナンスのお知らせ"
          />
          <div className={styles.charCount}>
            <span
              className={
                title.length >= MAX_TITLE_LENGTH ? styles.charCountWarning : ""
              }
            >
              {title.length}
            </span>
            <span> / {MAX_TITLE_LENGTH}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            内容<span className={styles.requiredBadge}>必須</span>
          </label>
          <textarea
            id="content"
            className={styles.textareaField}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            required
            rows={6}
            placeholder="お知らせの詳細内容を入力してください"
          />
          <div className={styles.charCount}>
            <span
              className={
                content.length >= MAX_CONTENT_LENGTH
                  ? styles.charCountWarning
                  : ""
              }
            >
              {content.length}
            </span>
            <span> / {MAX_CONTENT_LENGTH}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            配信先<span className={styles.requiredBadge}>必須</span>
          </label>
          <div style={{ maxWidth: "100%" }}>
            {isFetching ? (
              <p style={{ color: "#666", padding: "10px" }}>
                グループ情報を読み込み中...
              </p>
            ) : groups.length > 0 ? (
              <GroupSelector
                data={groups}
                onSelect={setSelectedGroupId}
                selectedId={selectedGroupId ?? undefined}
              />
            ) : (
              <p style={{ color: "red" }}>グループ情報の取得に失敗しました</p>
            )}
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            {selectedGroupId
              ? "※選択された範囲とその配下すべてに配信されます"
              : "配信範囲を選択してください"}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              !title || !content || !selectedGroupId || isCreating || isFetching
            }
          >
            {isCreating ? "送信中..." : "作成する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotice;
