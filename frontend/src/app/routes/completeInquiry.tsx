import styles from "@/styles/confirm.module.css";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";

const CompleteInquiry = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.complete}>送信が完了しました</h1>
      <p className={styles.guide}>
        お問い合わせありがとうございます。
        <br className={styles.br} />
        返信には数日いただく場合がございます。
        <br />
        ご登録されたメールアドレスの受信ボックスをご確認ください。
      </p>
      <div className={styles.buttonContainer}>
        <Button width="200px" fontSize="1rem">
          お問い合わせ画面に戻る
        </Button>
      </div>
    </div>
  );
};

export default CompleteInquiry;
