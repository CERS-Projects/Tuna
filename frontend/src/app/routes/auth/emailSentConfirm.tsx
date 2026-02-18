import styles from "@/styles/confirm.module.css";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { paths } from "@/config/paths";
import { useSendPasswordResetEmail } from "@/features/auth/hooks/useSendPasswordResetEmail";

const EmailSentConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email as string | undefined;
  const isSend = location.state?.isSend;

  const { mutate, isPending } = useSendPasswordResetEmail();

  useEffect(() => {
    if (!isSend || !email) {
      navigate(paths.auth.passReset.passReset.path, { replace: true });
    }
  }, [isSend, email, navigate]);

  const handleResend = () => {
    if (email) {
      mutate({ mailAddress: email });
    }
  };

  const handleChangeEmail = () => {
    navigate(paths.auth.passReset.passReset.path);
  };

  if (!email) return null;

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.complete}>Eメールを送信しました</h1>

      <p className={styles.mailGuide}>{`送信先メールアドレス: ${email}`}</p>

      <p className={styles.guide}>メールが届かない方は下記の項目へ</p>

      <div className={styles.buttonContainer}>
        <Button
          width="200px"
          fontSize="1rem"
          onClick={handleResend}
          disabled={isPending}
        >
          {isPending ? "送信中..." : "Eメール再送信"}
        </Button>

        <Button width="200px" fontSize="1rem" onClick={handleChangeEmail}>
          メールアドレス再設定
        </Button>
      </div>
    </div>
  );
};

export default EmailSentConfirm;
