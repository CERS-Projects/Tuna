import styles from "@/features/school/styles/confirmSchoolRequest.module.css";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";

const ConfirmSchoolRequest = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.compRequest}>申請が完了しました</h1>
      <p className={styles.guide}>
        学校アカウントの作成完了まで数日かかる場合がございます。
        <br className={styles.br} />
        管理者からの連絡をお待ちください。
        <br />
        二週間以上連絡がない場合は、お手数ですがお問い合わせください。
      </p>
      <div className={styles.buttonContainer}>
        <Button width="200px" fontSize="1rem">
          元の画面に戻る
        </Button>
      </div>
    </div>
  );
};

export default ConfirmSchoolRequest;
