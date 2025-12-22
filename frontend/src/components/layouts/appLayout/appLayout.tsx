import { Header } from "@/components/ui/header/header";
import { Menu } from "@/features/timeline/components/menu/menu";
import styles from "./appLayout.module.css";

type Props = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: Props) => {
  return (
    <div className={styles.appLayoutContainer}>
      <Header />
      <div className={styles.appLayoutArea}>
        <div className={styles.appLayoutLeft}>
          <Menu />
        </div>
        <div className={styles.appLayoutRight}>{children}</div>
      </div>
    </div>
  );
};
