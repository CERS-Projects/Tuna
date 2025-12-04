import { FaFish } from "react-icons/fa";
import { Header } from "@/components/ui/header/header";
import style from "@/styles/accountLock.module.css";
import { Button } from "@/components/ui/button/button";
import { Link } from "react-router";
import { paths } from "@/config/paths";
const accoutsLock = () => {
  return (
    <>
      <Header />
      <div className={style.accountLockContainer}>
        <FaFish className={style.FaFish} />
        <div className={style.textContainer}>
          <h1>アカウントが停止されています</h1>
        </div>
        <p>教員への確認をお願いします</p>
        <Link to={paths.welcome.getHref()} className={style.backLink}>
          <Button height="60px" width="300px" fontSize={20}>
            ログイン画面へ戻る
          </Button>
        </Link>
      </div>
    </>
  );
};
export default accoutsLock;
