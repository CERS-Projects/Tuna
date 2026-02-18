import { useEffect, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form"; // RHF導入
import styles from "@/features/management/style/editNotice.module.css";
import { useNotices } from "@/features/management/hooks/useNotices";
import { useUpdateNotice } from "@/features/management/hooks/useUpdateNotice";
import { Spinner } from "@/components/ui/spinner/spinner";
import { paths } from "@/config/paths";

type EditNoticeFormValues = {
  title: string;
  content: string;
  groupId: number;
};

const EditNoticePage = () => {
  const { state } = useLocation();
  const { noticeId: id } = useParams();
  const navigate = useNavigate();

  const { notices, isLoading } = useNotices();
  const { updateNotice, isUpdating } = useUpdateNotice();

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<EditNoticeFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      groupId: 0,
    },
  });

  const targetNotice = useMemo(() => {
    if (state?.notice) return state.notice;
    if (notices.length > 0 && id) {
      return notices.find((n) => String(n.noticeId) === String(id));
    }
    return null;
  }, [id, state, notices]);

  useEffect(() => {
    if (targetNotice) {
      reset({
        title: targetNotice.title,
        content: targetNotice.content,
        groupId: targetNotice.groupId,
      });
    }
  }, [targetNotice, reset]);

  const titleValue = watch("title");
  const contentValue = watch("content");

  const onSubmit: SubmitHandler<EditNoticeFormValues> = (data) => {
    if (!id) return;

    updateNotice(
      {
        noticeId: id,
        title: data.title,
        content: data.content,
        groupId: data.groupId,
      },
      {
        onSuccess: () => {
          alert("お知らせを更新しました");
          navigate(paths.app.management.notice.path);
        },
        onError: () => {
          alert("更新に失敗しました。");
        },
      },
    );
  };

  if (isLoading || isUpdating) {
    return <Spinner isDark={isUpdating} />;
  }

  if (!targetNotice && !isLoading) {
    return (
      <div className={styles.pageContainer}>
        <p>該当するお知らせが見つかりませんでした。</p>
        <button onClick={() => navigate(paths.app.management.notice.path)}>
          一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>お知らせ編集</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル <span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            disabled={isUpdating}
            {...register("title", {
              required: true,
              maxLength: MAX_TITLE_LENGTH,
            })}
          />
          <div className={styles.charCount}>
            <span>
              {titleValue?.length || 0} / {MAX_TITLE_LENGTH}
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
            disabled={isUpdating}
            rows={8}
            {...register("content", {
              required: true,
              maxLength: MAX_CONTENT_LENGTH,
            })}
          />
          <div className={styles.charCount}>
            <span>
              {contentValue?.length || 0} / {MAX_CONTENT_LENGTH}
            </span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isValid || isUpdating || !targetNotice}
          >
            {isUpdating ? "更新中..." : "更新する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNoticePage;
