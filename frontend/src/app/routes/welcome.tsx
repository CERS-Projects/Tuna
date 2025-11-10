import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";
import { ExplanationList } from "@/features/welcome/components/explanation/explanation";
import styles from "@/features/welcome/styles/welcome.module.css";

const values = [
  {
    title: "情報の共有によるグループ間のコミュニケーションの向上",
    text: "学校内外で様々な情報の共有、趣味の共有を行い生徒間、教員問わず会話や活動を促すことによるコミュニケーションの活性化を目指します",
  },
  {
    title: "勉強ノウハウの共有による、学習効率の向上",
    text: "生徒や教員が学習状況を掲載することによる知識の共有、勉強法の共有を行い生徒、教員の学習効率の上昇を目指します",
  },
  {
    title: "学校内や学校間での交流や情報共有",
    text: "学校同士の交流や情報を共有ことにより、各学校の教員同士の連携、イベントなど通じた交流を目指します",
  },
];

const Welcome = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeMidashi}>
          <div className={styles.welcomeTitle}>Welcome to Tuna!!</div>
          <div className={styles.welcomeButton}>
            <Button onClick={() => console.log("aaaaa")}>
              学校法人の方はこちら
            </Button>
            <Button onClick={() => console.log("aaaaa")}>ログイン</Button>
          </div>
        </div>
        <hr className={styles.underLine} />
        <div className={styles.welcomeGaiyou}>
          <ExplanationList explanationList={values} />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
