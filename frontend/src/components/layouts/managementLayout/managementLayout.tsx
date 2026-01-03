import { Header } from "@/components/ui/header/header";
import { Menu } from "@/components/ui/menu/menu";
import { MenuDrawer } from "@/features/management/components/menuDrawer/menuDrawer";
import { FaChevronRight } from "react-icons/fa";
import styles from "./managementLayout.module.css";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const ManagementLayout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 960) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.layoutContainer}>
      <Header />

      {!isMobile ? (
        <div className={styles.container}>
          <aside className={styles.menuContainer}>
            <div className={styles.menuWrapper}>
              <Menu />
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className={
                isOpen
                  ? `${styles.openDrawer} ${styles.closeDrawer}`
                  : styles.openDrawer
              }
            >
              <FaChevronRight />
            </button>
            <MenuDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </aside>

          <main className={styles.main}>{children}</main>
        </div>
      ) : (
        // 960px以下のレイアウト
        <div className={styles.container}>
          <div className={styles.contentContainer}>
            <button
              onClick={() => setIsOpen(true)}
              className={styles.openDrawer}
              style={isOpen ? { display: "none" } : { display: "flex" }}
            >
              <FaChevronRight />
            </button>
            <MenuDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <main className={styles.main}>{children}</main>
          </div>

          <div className={styles.menuWrapper}>
            <Menu />
          </div>
        </div>
      )}
    </div>
  );
};
