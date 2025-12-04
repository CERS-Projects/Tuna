import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { useForm } from "react-hook-form";
import styles from "@/features/auth/styles/passwordReset.module.css";

type passwordForm = {
  mailaddress: string;
  userid: string;
};

export const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<passwordForm>();

  const onSubmit = (data: passwordForm) => {
    console.log(data);
  };
  console.log("error", errors);

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.passwordResetContainer}>
          <h1>パスワードの再設定</h1>
          <Input
            width={455}
            height={45}
            label="ユーザーID"
            type="text"
            placeholder="student1234"
            error={errors["userid"]?.message ?? ""}
            {...register("userid", {
              required: "ユーザーIDは必須です",
              maxLength: {
                value: 32,
                message: "ユーザー名は32字以内です",
              },
            })}
          />
          <Input
            width={455}
            height={45}
            label="メールアドレス"
            type="text"
            placeholder="tuna@tuna.jp"
            error={errors["mailaddress"]?.message ?? ""}
            {...register("mailaddress", {
              required: "メールアドレスは必須です",
              maxLength: {
                value: 256,
                message: "256字以内で入力してください",
              },
            })}
          />
          <Button type="submit" className={styles.passwordResetButton}>
            メールを送信する
          </Button>
        </div>
      </form>
    </>
  );
};

export default PasswordReset;
