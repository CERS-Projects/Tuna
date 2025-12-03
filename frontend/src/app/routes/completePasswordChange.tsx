import styles from "@/styles/confirm.module.css";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";

const CompletePasswordChange = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.complete}>変更が完了しました</h1>
      <p className={styles.guide}>
        変更後のパスワードが使用できない場合は、再設定またはお問い合わせください。
      </p>
      <div className={styles.buttonContainer}>
        <Button width="200px" fontSize="1rem">
          元の画面に戻る
        </Button>
      </div>
    </div>
  );
};

export default CompletePasswordChange;
