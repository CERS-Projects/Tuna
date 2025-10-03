import * as React from "react";
import { Spinner } from "../components/spinner/spinner";
import styles from "../styles/center.module.css";

type AppProviderProps = {
  children: React.ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className={styles.fullScreenCenter}>
          <Spinner />
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

export default AppProvider;
