import styles from "@/features/auth/styles/twoFactorAuth.module.css";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Header } from "@/components/ui/header/header";
import { useForm } from "react-hook-form";

type OnetimePassword = {
  ワンタイムパスワード: string;
};

const TwoFactorAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnetimePassword>();

  const onSubmit = (data: OnetimePassword) => {
    console.log("申請しました", data);
  };
  return (
    <>
      <Header />
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.title}>
          <h1>ワンタイムパスワード入力</h1>
        </div>

        <p className={styles.text}>
          登録されているメールアドレスにワンタイムパスワードを送信しました。メールに記載されているワンタイムパスワードを入力してください。
        </p>
        <div className={styles.components}>
          <Input
            width="100%"
            placeholder="ワンタイムパスワードを入力"
            error={errors["ワンタイムパスワード"]?.message ?? ""}
            {...register("ワンタイムパスワード", {
              required: "ワンタイムパスワードを入力してください",
            })}
          />
          <Button type="submit" width="190px" fontSize="1.2rem">
            認証
          </Button>
        </div>
      </form>
    </>
  );
};

export default TwoFactorAuth;
