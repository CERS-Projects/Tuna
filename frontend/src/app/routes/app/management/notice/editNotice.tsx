import { useState, useEffect, useMemo, type FormEvent } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import styles from "@/features/notice/styles/editNotice.module.css";
import { useNotices } from "@/features/notice/hooks/useNotices";
import { useUpdateNotice } from "@/features/notice/hooks/useUpdateNotice";
import { Spinner } from "@/components/ui/spinner/spinner";
import { paths } from "@/config/paths";

const EditNoticePage = () => {
  const { state } = useLocation();
  const { noticeId: id } = useParams();
  const navigate = useNavigate();

  const { notices, isLoading } = useNotices();
  const { updateNotice, isUpdating } = useUpdateNotice();

  const targetNotice = useMemo(() => {
    if (state?.notice) return state.notice;

    if (notices.length > 0 && id) {
      return notices.find((n) => String(n.noticeId) === String(id));
    }
    return null;
  }, [id, state, notices]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  useEffect(() => {
    if (targetNotice) {
      setTitle(targetNotice.title);
      setContent(targetNotice.content);
      setGroupId(targetNotice.groupId);
    }
  }, [targetNotice]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!id || !title || !content || groupId === null) {
      return;
    }

    try {
      await updateNotice({
        noticeId: id,
        title: title,
        content: content,
        groupId: groupId,
      });
      alert("お知らせを更新しました");
      navigate(paths.app.management.notice.path);
    } catch (error) {
      alert("更新に失敗しました。");
    }
  };

  if (isLoading || isUpdating) {
    return <Spinner isDark={isUpdating} />;
  }

  if (!targetNotice) {
    return (
      <div className={styles.pageContainer}>
        <p>該当するお知らせが見つかりませんでした。</p>
        <button onClick={() => navigate("/manager/notice")}>一覧へ戻る</button>
      </div>
    );
  }

  if (groupId === null) {
    return <Spinner />;
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>お知らせ編集</h2>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル <span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            disabled={isUpdating}
            required
          />
          <div className={styles.charCount}>
            <span>
              {title.length} / {MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            内容 <span className={styles.requiredBadge}>必須</span>
          </label>
          <textarea
            id="content"
            className={styles.textareaField}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            disabled={isUpdating}
            required
            rows={8}
          />
          <div className={styles.charCount}>
            <span>
              {content.length} / {MAX_CONTENT_LENGTH}
            </span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!title || !content || isUpdating}
          >
            {isUpdating ? "更新中..." : "更新する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNoticePage;
