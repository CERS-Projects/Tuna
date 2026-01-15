import { useForm } from "react-hook-form";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "../../types/account";
import styles from "./accountEditForm.module.css";

export const StudentAccountEditForm = ({
  userId,
  email,
  name,
  accountStopFlag,
  grade,
  graduateDate,
}: StudentAccountEditType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentAccountEditType>({
    defaultValues: {
      userId,
      email,
      name,
      accountStopFlag,
      grade,
      graduateDate,
    },
  });

  const onSubmit = (formData: StudentAccountEditType) => {
    const data = {
      ...formData,
      accountStopFlag: formData.accountStopFlag ? 1 : 0,
    };
    console.log(`生徒情報更新:${userId}:`, data);
  };

  return (
    <form
      id="accountEditForm"
      className={styles.editForm}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}
    >
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
        <label htmlFor="isStop">停止 / 停止解除（off:利用可, on:停止中）</label>
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
    </form>
  );
};

export const TeacherAccountEditForm = ({
  userId,
  email,
  name,
  accountStopFlag,
  authority,
}: TeacherAccountEditType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherAccountEditType>({
    defaultValues: {
      userId,
      email,
      name,
      accountStopFlag,
      authority,
    },
  });

  const onSubmit = (formData: TeacherAccountEditType) => {
    const data = {
      ...formData,
      accountStopFlag: formData.accountStopFlag ? 1 : 0,
      authority: formData.authority ? 1 : 0,
    };

    console.log(`教師情報更新:${userId}:`, data);
  };

  return (
    <form
      id="accountEditForm"
      className={styles.editForm}
      onSubmit={handleSubmit(onSubmit)}
      onKeyDownCapture={(e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
      }}
    >
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
        <label htmlFor="isStop">停止 / 停止解除（off:利用可, on:停止中）</label>
        <input id="isStop" type="checkbox" {...register("accountStopFlag")} />
      </div>

      <div className={styles.toggle}>
        <label htmlFor="authority">権限（off:教師, on:学校管理者）</label>
        <input id="authority" type="checkbox" {...register("authority")} />
      </div>
    </form>
  );
};
