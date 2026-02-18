import { useForm } from "react-hook-form";
import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { Link, useLocation } from "react-router";
import styles from "@/features/auth/styles/login.module.css";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type LoginInfo } from "@/features/auth/types/auth";
import { type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { TermsOfService } from "@/features/termsOfService/components/termsOfContentModal/termsOfService";
import { paths } from "@/config/paths";

export const Login = () => {
  const { login, isLoggingIn } = useAuth();
  const location = useLocation();
  const errorMessage = location.state?.errorMessage;

  const termsModalRef = useRef<ModalHandle>(null);

  const handleOpenTermsModal = () => {
    if (termsModalRef.current) {
      termsModalRef.current.show();
    }
  };

  const { register, handleSubmit, formState } = useForm<LoginInfo>();

  const onSubmit = (data: LoginInfo) => {
    login(data);
  };

  return (
    <>
      <Header />
      <form className={styles.loginContainer} onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
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
          <button
            type="button"
            className={styles.loginLink}
            onClick={handleOpenTermsModal}
          >
            利用規約
          </button>
          <Link
            to={paths.auth.passReset.passReset.path}
            className={styles.loginLink}
          >
            パスワードをお忘れですか？
          </Link>
        </div>

        <Button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "..." : "ログイン"}
        </Button>
      </form>
      <TermsOfService ref={termsModalRef} />
    </>
  );
};

export default Login;
