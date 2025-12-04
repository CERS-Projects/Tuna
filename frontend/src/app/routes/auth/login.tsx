import { Header } from "@/components/ui/header/header.tsx";
import { Button } from "@/components/ui/button/button.tsx";
import { Input } from "@/components/ui/input/input.tsx";
import { Link } from "react-router";
import styles from "@/features/auth/styles/login.module.css";

export const Login = () => {
  return (
    <>
      <Header />
      <div className={styles.loginContainer}>
        <Input
          width={455}
          height={45}
          label="ユーザーID"
          type="text"
          placeholder="student1234"
        />
        <Input
          width={455}
          height={45}
          label="パスワード"
          type="text"
          placeholder="password"
        />

        <Link to="" className={styles.loginLink}>
          利用規約
        </Link>
        <Link to="" className={styles.loginLink}>
          パスワードをお忘れですか？
        </Link>
        <Button width={"300px"} height={"70px"} fontSize={"1.5em"}>
          ログイン
        </Button>
      </div>
    </>
  );
};

export default Login;
