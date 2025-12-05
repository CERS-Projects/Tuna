import type React from "react";
import styles from "./infoBox.module.css";

type InfoProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const InfoBox = ({ children }: InfoProps) => {
  return <div className={styles.infoBox}>{children}</div>;
};
