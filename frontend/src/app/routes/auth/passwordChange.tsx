import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { useForm } from "react-hook-form";
import styles from "@/features/auth/styles/passwordChange.module.css";
import { type ChangePasswordForm } from "@/features/auth/types/form";
import {
  useConfirmToken,
  usePasswordReset,
} from "@/features/auth/hooks/usePasswordChange";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner/spinner";

export const PasswordChange = () => {
  const { mutate: confirmMutate, isPending: isConfirmPending } =
    useConfirmToken();
  const { mutate: passResetMutate, isPending: isPassResetPending } =
    usePasswordReset();

  const [isInvalid, setIsInvalid] = useState<boolean>();

  useEffect(() => {
    confirmMutate(undefined, {
      onSuccess: () => setIsInvalid(false),
      onError: () => setIsInvalid(true),
    });
  }, [confirmMutate]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const onSubmit = (data: ChangePasswordForm) => {
    passResetMutate(data);
  };

  const newPassword = watch("newPassword", "");

  return (
    <>
      <Header />
      {isConfirmPending ? (
        <Spinner isDark={true} />
      ) : !isInvalid ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.passwordChangeContainer}>
            <h1>パスワードの変更</h1>
            <Input
              width={455}
              height={45}
              label="新しいパスワード"
              type="password"
              placeholder="Tuna1234"
              error={errors["newPassword"]?.message ?? ""}
              {...register("newPassword", {
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
                  hasUpperCase: (value) =>
                    /(?=.*[A-Z])/.test(value) ||
                    "大文字を1文字以上含めてください",
                  hasLowerCase: (value) =>
                    /(?=.*[a-z])/.test(value) ||
                    "小文字を1文字以上含めてください",
                  hasNumberCase: (value) =>
                    /(?=.*[0-9])/.test(value) ||
                    "数字を1文字以上含めてください",
                },
              })}
            />
            <Input
              width={455}
              height={45}
              label="確認用のためもう一度入力してください"
              type="password"
              placeholder="Tuna1234"
              error={errors["rePassword"]?.message ?? ""}
              {...register("rePassword", {
                required: "パスワードが一致しません",
                validate: (value) => {
                  return value === newPassword || "パスワードが一致しません";
                },
              })}
            />
            <Button
              type="submit"
              className={styles.passwordChangeButton}
              disabled={isPassResetPending}
            >
              {isPassResetPending ? "送信中..." : "変更"}
            </Button>
          </div>
        </form>
      ) : (
        <p>
          無効なURLです。お手数ですが、パスワード再設定メールを再度送信し、新しいURLからアクセスしてください。
        </p>
      )}
    </>
  );
};

export default PasswordChange;
