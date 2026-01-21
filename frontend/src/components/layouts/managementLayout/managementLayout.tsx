import { Header } from "@/components/ui/header/header";
import { Menu } from "@/components/ui/menu/menu";
import { MenuDrawer } from "@/features/management/components/menuDrawer/menuDrawer";
import { FaChevronRight } from "react-icons/fa";
import styles from "./managementLayout.module.css";
import React, { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const ManagementLayout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.layoutContainer}>
      <Header />

      <div
        className={`${styles.container} ${isOpen ? styles.containerOpen : ""}`}
      >
        <div className={styles.menuWrapper}>
          <Menu />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={
            isOpen
              ? `${styles.openDrawer} ${styles.closeDrawer}`
              : styles.openDrawer
          }
          aria-label="メニューを開く"
          aria-expanded={isOpen}
        >
          <FaChevronRight />
        </button>

        {isOpen && (
          <div className={styles.drawerWrapper}>
            <MenuDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        )}

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};
