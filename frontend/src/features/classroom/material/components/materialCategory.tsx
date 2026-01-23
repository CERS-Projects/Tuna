import { useState, useMemo } from "react";
import styles from "./materialCategory.module.css";
import {
  MdKeyboardArrowRight,
  MdOutlinePictureAsPdf,
  MdFileDownload,
} from "react-icons/md";

import { type MaterialType, type CategoryType } from "../types/material";

type MaterialProps = {
  categories: categoryType[];
  items: materialType[];
};

export const MaterialCategory = ({ categories, items }: MaterialProps) => {
  const [openIds, setOpenIds] = useState<number[]>([]);

  const groupedData = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      children: items.filter((item) => item.categoryId === cat.id),
    }));
  }, [categories, items]);

  const toggleCategory = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id)
        ? prev.filter((openId) => openId !== id)
        : [...prev, id],
    );
  };

  return (
    <div className={styles.container}>
      {groupedData.map((category) => {
        const isOpen = openIds.includes(category.id);
        return (
          <div key={category.id} className={styles.section}>
            <button
              className={`${styles.header} ${isOpen ? styles.headerActive : ""}`}
              onClick={() => toggleCategory(category.id)}
              aria-expanded={isOpen}
            >
              <MdKeyboardArrowRight
                className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
              />
              <span className={styles.title}>{category.name}</span>
            </button>
            <div
              className={`${styles.gridWrapper} ${isOpen ? styles.gridWrapperOpen : ""}`}
              aria-hidden={!isOpen}
            >
              <div className={styles.overflowInner}>
                <div className={styles.contentList}>
                  {category.children.map((item) => (
                    <a
                      key={item.materialId}
                      href={item.fileUrl}
                      download={item.fileName}
                      className={styles.pdfLink}
                    >
                      <div className={styles.pdfMain}>
                        <MdOutlinePictureAsPdf className={styles.pdfIcon} />
                        <span className={styles.fileName}>{item.fileName}</span>
                      </div>
                      <div className={styles.pdfSub}>
                        <span className={styles.date}>{item.createdAt}</span>
                        <MdFileDownload className={styles.downloadIcon} />
                      </div>
                    </a>
                  ))}
                  {category.children.length === 0 && (
                    <p className={styles.noData}>
                      公開されている資料はありません
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
