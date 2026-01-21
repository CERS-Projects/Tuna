import styles from "./materialCard.module.css";
import { type MaterialType } from "../types/material";
import { MdOutlinePictureAsPdf, MdFileDownload } from "react-icons/md";

type materialProps = {
  item: MaterialType;
};

export const MaterialCard = ({ item }: materialProps) => {
  return (
    <div className={styles.materialCard}>
      <a href={item.fileUrl} download={item.fileName}>
        <div className={styles.materialContent}>
          <div className={styles.titleArea}>
            <h3>{item.title}</h3>
          </div>
          <hr className={styles.divider} />
          <div className={styles.fileMeta}>
            <MdOutlinePictureAsPdf className={styles.pdfIcon} />
            <span className={styles.fileName}>{item.fileName}</span>
            <MdFileDownload className={styles.downloadIcon} />
          </div>
        </div>
      </a>
    </div>
  );
};
