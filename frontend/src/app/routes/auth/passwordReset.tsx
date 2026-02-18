import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { useForm } from "react-hook-form";
import styles from "@/features/auth/styles/passwordReset.module.css";
import { type passwordResetForm } from "@/features/auth/types/form";
import { useSendPasswordResetEmail } from "@/features/auth/hooks/useSendPasswordResetEmail";

export const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<passwordResetForm>();

  const { mutate, isPending } = useSendPasswordResetEmail();

  const onSubmit = (data: passwordResetForm) => {
    mutate(data);
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.passwordResetContainer}>
          <h1>パスワードの再設定</h1>

          <Input
            width={455}
            height={45}
            label="メールアドレス"
            type="text"
            placeholder="tuna@tuna.jp"
            error={errors["mailAddress"]?.message ?? ""}
            {...register("mailAddress", {
              required: "メールアドレスは必須です",
              maxLength: {
                value: 256,
                message: "256字以内で入力してください",
              },
            })}
          />
          <Button type="submit" className={styles.passwordResetButton}>
            {isPending ? "送信中..." : "メールを送信する"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PasswordReset;
