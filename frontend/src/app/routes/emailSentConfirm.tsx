import styles from "@/styles/confirm.module.css";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";

const EmailSentConfirm = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.complete}>Eメールを送信しました</h1>
      <p className={styles.guide}>メールが届かない方は下記の項目へ</p>
      <div className={styles.buttonContainer}>
        <Button width="200px" fontSize="1rem">
          Eメール再送信
        </Button>
        <Button width="200px" fontSize="1rem">
          メールアドレス再設定
        </Button>
      </div>
    </div>
  );
};

export default EmailSentConfirm;
