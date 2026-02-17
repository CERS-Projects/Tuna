import { useNavigate } from "react-router";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import styles from "@/features/management/style/createNotice.module.css";
import GroupSelector from "@/features/management/components/groupSelector/groupSelector";
import { useGroups } from "@/features/management/hooks/useGroups";
import { useCreateNotice } from "@/features/management/hooks/useCreateNotice";
import { paths } from "@/config/paths";

type CreateNoticeFormValues = {
  title: string;
  content: string;
  groupId: number | null;
};

const CreateNotice = () => {
  const navigate = useNavigate();

  const { groups, isFetching } = useGroups();
  const { createNotice, isCreating } = useCreateNotice();

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 200;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm<CreateNoticeFormValues>({
    defaultValues: {
      title: "",
      content: "",
      groupId: null,
    },
    mode: "onChange",
  });

  const titleValue = watch("title");
  const contentValue = watch("content");
  const groupIdValue = watch("groupId");

  const onSubmit: SubmitHandler<CreateNoticeFormValues> = (data) => {
    if (!data.groupId) return;

    createNotice(
      {
        title: data.title,
        content: data.content,
        groupId: data.groupId,
      },
      {
        onSuccess: () => {
          alert("お知らせを作成しました");
          navigate(paths.app.management.notice.path);
        },
        onError: () => {
          alert("お知らせの作成に失敗しました");
        },
      },
    );
  };

  return (
    <div className={styles.pageContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル<span className={styles.requiredBadge}>必須</span>
          </label>
          <input
            id="title"
            type="text"
            className={styles.inputField}
            placeholder="例：システムメンテナンスのお知らせ"
            {...register("title", {
              required: true,
              maxLength: MAX_TITLE_LENGTH,
            })}
          />
          <div className={styles.charCount}>
            <span
              className={
                (titleValue?.length || 0) >= MAX_TITLE_LENGTH
                  ? styles.charCountWarning
                  : ""
              }
            >
              {titleValue?.length || 0}
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
            rows={6}
            placeholder="お知らせの詳細内容を入力してください"
            {...register("content", {
              required: true,
              maxLength: MAX_CONTENT_LENGTH,
            })}
          />
          <div className={styles.charCount}>
            <span
              className={
                (contentValue?.length || 0) >= MAX_CONTENT_LENGTH
                  ? styles.charCountWarning
                  : ""
              }
            >
              {contentValue?.length || 0}
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
              <Controller
                control={control}
                name="groupId"
                rules={{ required: true }}
                render={({ field }) => (
                  <GroupSelector
                    data={groups}
                    onSelect={(id) => field.onChange(id)}
                    selectedId={field.value ?? undefined}
                  />
                )}
              />
            ) : (
              <p style={{ color: "red" }}>グループ情報の取得に失敗しました</p>
            )}
          </div>
          <div style={{ marginTop: "8px", fontSize: "0.85rem", color: "#666" }}>
            {groupIdValue
              ? "※選択された範囲とその配下すべてに配信されます"
              : "配信範囲を選択してください"}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isValid || isCreating || isFetching}
          >
            {isCreating ? "送信中..." : "作成する"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotice;
