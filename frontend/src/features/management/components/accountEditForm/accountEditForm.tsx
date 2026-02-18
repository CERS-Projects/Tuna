import { useForm } from "react-hook-form";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "../../types/account";
import styles from "./accountEditForm.module.css";

type StudentFormProps = StudentAccountEditType & {
  onSubmit: (data: StudentAccountEditType) => void;
  isPending: boolean;
};

type TeacherFormProps = TeacherAccountEditType & {
  onSubmit: (data: TeacherAccountEditType) => void;
  isPending: boolean;
};

export const StudentAccountEditForm = ({
  userId,
  showUserId,
  email,
  name,
  accountStopFlag,
  grade,
  graduateDate,
  onSubmit: onSubmitProp,
  isPending,
}: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StudentAccountEditType>({
    defaultValues: {
      userId,
      showUserId,
      email,
      name,
      accountStopFlag,
      grade,
      graduateDate,
    },
  });

  const watchStopFlag = watch("accountStopFlag");

  const onSubmit = (formData: StudentAccountEditType) => {
    onSubmitProp(formData);
  };

  return (
    <form
      id="accountEditForm"
      className={styles.editForm}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}>
      <fieldset disabled={isPending}>
        <div className={styles.row}>
          <div className={`${styles.input} ${styles.rowGrow}`}>
            <label htmlFor="accountName">名前</label>
            <input
              id="accountName"
              type="text"
              placeholder="名前を入力..."
              {...register("name", { required: "ユーザー名は必須です" })}
            />
            {errors.name?.message && (
              <p className={styles.isError}>{errors.name.message}</p>
            )}
          </div>

          <div className={`${styles.input} ${styles.rowNarrow}`}>
            <label htmlFor="grade">学年</label>
            <input
              id="grade"
              type="number"
              placeholder="数字で入力..."
              {...register("grade", {
                required: "学年は必須です",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "1以上の数値を入力してください",
                },
              })}
            />
            {errors.grade?.message && (
              <p className={styles.isError}>{errors.grade.message}</p>
            )}
          </div>
        </div>

        <div className={`${styles.input} ${styles.emailField}`}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレスを入力..."
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message:
                  "有効なメールアドレスを入力してください（例: school@example.com）",
              },
            })}
          />
          {errors.email?.message && (
            <p className={styles.isError}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.toggle}>
          <label htmlFor="isStop">
            現在：{watchStopFlag ? "停止中" : "利用可"}（off:利用可 on:停止中）
          </label>
          <input id="isStop" type="checkbox" {...register("accountStopFlag")} />
        </div>

        <div className={`${styles.input} ${styles.dateField}`}>
          <label htmlFor="expectedGraduation">卒業見込み</label>
          <input
            id="expectedGraduation"
            type="date"
            {...register("graduateDate", { required: "この項目は必須です" })}
          />
          {errors.graduateDate?.message && (
            <p className={styles.isError}>{errors.graduateDate.message}</p>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export const TeacherAccountEditForm = ({
  userId,
  showUserId,
  email,
  name,
  accountStopFlag,
  authority,
  onSubmit: onSubmitProp,
  isPending,
}: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TeacherAccountEditType>({
    defaultValues: {
      userId,
      showUserId,
      email,
      name,
      accountStopFlag,
      authority,
    },
  });

  const watchStopFlag = watch("accountStopFlag");
  const watchAuthority = watch("authority");

  const onSubmit = (formData: TeacherAccountEditType) => {
    onSubmitProp(formData);
  };

  return (
    <form
      id="accountEditForm"
      className={styles.editForm}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}>
      <fieldset disabled={isPending}>
        <div className={`${styles.input}`}>
          <label htmlFor="accountName">名前</label>
          <input
            id="accountName"
            type="text"
            placeholder="名前を入力..."
            {...register("name", { required: "ユーザー名は必須です" })}
          />
          {errors.name?.message && (
            <p className={styles.isError}>{errors.name.message}</p>
          )}
        </div>

        <div className={`${styles.input} ${styles.emailField}`}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレスを入力..."
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message:
                  "有効なメールアドレスを入力してください（例: school@example.com）",
              },
            })}
          />
          {errors.email?.message && (
            <p className={styles.isError}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.toggle}>
          <label htmlFor="isStop">
            {watchStopFlag ? "停止中" : "利用可"}（off:利用可, on:停止中）
          </label>
          <input id="isStop" type="checkbox" {...register("accountStopFlag")} />
        </div>

        <div className={styles.toggle}>
          <label htmlFor="authority">
            {watchAuthority ? "学校管理者" : "教師"}（off:教師, on:学校管理者）
          </label>
          <input id="authority" type="checkbox" {...register("authority")} />
        </div>
      </fieldset>
    </form>
  );
};
