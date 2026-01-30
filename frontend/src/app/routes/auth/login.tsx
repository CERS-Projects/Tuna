import { useForm } from "react-hook-form";
import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { Link } from "react-router";
import styles from "@/features/auth/styles/login.module.css";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type LoginInfo } from "@/features/auth/types/auth"; // パスは環境に合わせて調整してください

export const Login = () => {
  const { login, isLoggingIn } = useAuth();

  const { register, handleSubmit, formState } = useForm<LoginInfo>();

  const onSubmit = (data: LoginInfo) => {
    login(data);
  };

  return (
    <>
      <Header />
      <form className={styles.loginContainer} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="ユーザーID"
          type="text"
          placeholder="student1234"
          {...register("showUserId", {
            required: "ユーザIDを入力してください",
          })}
          error={formState.errors.showUserId?.message ?? ""}
        />
        <Input
          label="パスワード"
          type="password"
          placeholder="password"
          {...register("password", {
            required: "パスワードを入力してください",
          })}
          error={formState.errors.password?.message ?? ""}
        />

        <div className={styles.loginLinks}>
          <Link to="" className={styles.loginLink}>
            利用規約
          </Link>
          <Link to="" className={styles.loginLink}>
            パスワードをお忘れですか？
          </Link>
        </div>

        <Button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "..." : "ログイン"}
        </Button>
      </form>
    </>
  );
};

export default Login;
