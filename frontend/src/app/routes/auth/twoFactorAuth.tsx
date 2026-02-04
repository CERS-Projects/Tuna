import styles from "@/features/auth/styles/twoFactorAuth.module.css";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Header } from "@/components/ui/header/header";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/hooks/useAuth";

type OnetimePassword = {
  onetimepassword: string;
};

const TwoFactorAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnetimePassword>();

  const { otpTempToken, otpLogin, isOtpLoggingIn } = useAuth();

  const onSubmit = (data: OnetimePassword) => {
    otpLogin({ otpToken: otpTempToken, otp: data.onetimepassword });
  };

  return (
    <>
      <Header />
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.title}>
          <h1>ワンタイムパスワード入力</h1>
        </div>

        <p className={styles.otpInstruction}>
          登録されているメールアドレスにワンタイムパスワードを送信しました。メールに記載されているワンタイムパスワードを入力してください。
        </p>
        <div className={styles.otpActions}>
          <Input
            width="100%"
            placeholder="ワンタイムパスワードを入力"
            type="number"
            error={errors["onetimepassword"]?.message ?? ""}
            {...register("onetimepassword", {
              required: "ワンタイムパスワードを入力してください",
            })}
          />
          <Button type="submit" width="190px" fontSize="1.2rem">
            {isOtpLoggingIn ? "..." : "ログイン"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default TwoFactorAuth;
