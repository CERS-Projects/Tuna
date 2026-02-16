import { useForm } from "react-hook-form";
import styles from "@/features/profile/styles/editPassword.module.css";
import { type EditPasswordForm } from "@/features/profile/types/setting";
import { useUpdatePassword } from "@/features/profile/hooks/useUpdatePassword";
import { Spinner } from "@/components/ui/spinner/spinner";

const EditPassword = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPasswordForm>({
    mode: "onChange",
  });

  const { mutate, isPending } = useUpdatePassword();

  const newPasswordValue = watch("newPassword");

  const onSubmit = (data: EditPasswordForm) => {
    if (confirm("パスワードを変更しますか？")) mutate(data);
  };

  const passwordValidationRules = {
    required: "パスワードを入力してください",
    minLength: {
      value: 8,
      message: "パスワードは8文字以上で入力してください",
    },
    maxLength: {
      value: 24,
      message: "パスワードは24文字以下で入力してください",
    },
    pattern: {
      value: /^[a-zA-Z0-9]+$/,
      message: "半角英数字のみ使用できます",
    },
    validate: {
      hasUpperCase: (value: string) =>
        /(?=.*[A-Z])/.test(value) || "大文字を1文字以上含めてください",
      hasLowerCase: (value: string) =>
        /(?=.*[a-z])/.test(value) || "小文字を1文字以上含めてください",
      hasNumberCase: (value: string) =>
        /(?=.*[0-9])/.test(value) || "数字を1文字以上含めてください",
    },
  };

  if (isPending) return <Spinner isDark={true} />;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>パスワード変更</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>現在のパスワード</label>
          <input
            type="password"
            placeholder="現在のパスワード"
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            {...register("password", { required: "入力必須です" })}
          />
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>新しいパスワード</label>
          <input
            type="password"
            placeholder="8~24文字の半角英数字"
            className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
            {...register("newPassword", passwordValidationRules)}
          />
          {errors.newPassword && (
            <p className={styles.errorMessage}>{errors.newPassword.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>新しいパスワード（確認）</label>
          <input
            type="password"
            placeholder="もう一度入力してください"
            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
            {...register("confirmPassword", {
              required: "確認のためもう一度入力してください",
              validate: (value) =>
                value === newPasswordValue || "パスワードが一致しません",
            })}
          />
          {errors.confirmPassword && (
            <p className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button type="submit" className={styles.submitButton}>
          更新
        </button>
      </form>
    </div>
  );
};

export default EditPassword;
