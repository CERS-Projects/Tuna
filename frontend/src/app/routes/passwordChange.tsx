import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { useForm } from "react-hook-form";
import styles from "@/features/auth/styles/passwordChange.module.css";

type changePasswordForm = {
  newpassword: string;
  repassword: string;
};

export const PasswordChange = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<changePasswordForm>();

  const onSubmit = (data: changePasswordForm) => {
    console.log("変更しました", data);
  };
  console.log("error", errors);

  const newPassword = watch("newpassword", "");

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.passwordChangeContainer}>
          <h1>パスワードの変更</h1>
          <Input
            width={455}
            height={45}
            label="新しいパスワード"
            type="password"
            placeholder="Tuna1234"
            error={errors["newpassword"]?.message ?? ""}
            {...register("newpassword", {
              required: "パスワードを入力してください",
              minLength: {
                value: 8,
                message: "パスワードは8文字以上で入力してください",
              },
              maxLength: {
                value: 24,
                message: "パスワードは24文字以下で入寮してください",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "半角英数字のみ使用できます",
              },
              validate: {
                hasUpperCase: (value) =>
                  /(?=.*[A-Z])/.test(value) ||
                  "大文字を1文字以上含めてください",
                hasLowerCase: (value) =>
                  /(?=.*[a-z])/.test(value) ||
                  "小文字を1文字以上含めてください",
                hasNumberCase: (value) =>
                  /(?=.*[0-9])/.test(value) || "数字を1文字以上含めてください",
              },
            })}
          />
          <Input
            width={455}
            height={45}
            label="確認用のためもう一度入力してください"
            type="password"
            placeholder="Tuna1234"
            {...register("repassword", {
              required: "パスワードが一致しません",
              validate: (value) => {
                return value === newPassword || "パスワードが一致しません";
              },
            })}
          />
          <Button type="submit" className={styles.passwordChangeButton}>
            変更
          </Button>
        </div>
      </form>
    </>
  );
};

export default PasswordChange;
