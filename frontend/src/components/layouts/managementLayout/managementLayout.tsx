import { Header } from "@/components/ui/header/header";
import { Menu } from "@/features/timeline/components/menu/menu";
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

      <div className={styles.container}>
        <aside className={styles.menuContainer}>
          <div className={styles.menuWrapper}>
            <Menu />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={styles.openDrawer}
            style={isOpen ? { display: "none" } : { display: "flex" }}
          >
            <FaChevronRight />
          </button>
          <MenuDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </aside>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};
