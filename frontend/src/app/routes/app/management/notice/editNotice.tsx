import { useState, useEffect, type FormEvent } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import styles from "@/features/notice/styles/editNotice.module.css";

type Notice = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
  targetGroups?: number[];
};

const EditNoticePage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState(state?.notice?.title || "");
  const [content, setContent] = useState(state?.notice?.content || "");

  const [originalNotice, setOriginalNotice] = useState<Notice | null>(
    state?.notice || null,
  );

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  useEffect(() => {
    if (!originalNotice && id) {
      const savedNoticesStr = localStorage.getItem("demo_notices");
      if (savedNoticesStr) {
        const notices: Notice[] = JSON.parse(savedNoticesStr);
        const target = notices.find((n) => n.id === Number(id));
        if (target) {
          setOriginalNotice(target);
          setTitle(target.title);
          setContent(target.content);
        } else {
          alert("該当のお知らせが見つかりませんでした。");
          navigate("/manager/notice");
        }
      }
    }
  }, [id, originalNotice, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content || !originalNotice) return;

    const updatedNotice: Notice = {
      ...originalNotice,
      title,
      content,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const savedNoticesStr = localStorage.getItem("demo_notices");
    const savedNotices: Notice[] = savedNoticesStr
      ? JSON.parse(savedNoticesStr)
      : [];

    const newNotices = savedNotices.map((notice) =>
      notice.id === Number(id) ? updatedNotice : notice,
    );

    localStorage.setItem("demo_notices", JSON.stringify(newNotices));

    navigate("/manager/notice");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!title && !originalNotice) return null;

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル
            <span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            required
            placeholder="タイトルを入力してください"
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
            内容
            <span className={styles.requiredBadge}>必須</span>
          </label>
          <textarea
            id="content"
            className={styles.textareaField}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_CONTENT_LENGTH}
            required
            rows={8}
            placeholder="内容を入力してください"
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

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!title || !content}
          >
            更新する
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNoticePage;
