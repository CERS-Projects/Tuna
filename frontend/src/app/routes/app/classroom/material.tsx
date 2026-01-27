import { MaterialCard } from "@/features/classroom/material/components/materialCard";
import { MaterialCategory } from "@/features/classroom/material/components/materialCategory";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { RiCompass3Line } from "react-icons/ri";
import { InfoBox } from "@/components/ui/infoBox/infoBox";
import styles from "@/features/classroom/material/styles/material.module.css";
import { useLocation } from "react-router";

<<<<<<< HEAD
const ClassData = {
  name: "c",
  description: "サカバンバスピス",
=======
type ClassData = {
  name: string;
  description: string;
>>>>>>> 8111413 (refactor:レビュー内容の修正。)
};

// 1. カテゴリー（親）のデータ
const sampleCategories = [
  { id: 1, name: "課題資料", createdAt: "2025/07/03" },
  { id: 2, name: "授業資料", createdAt: "2025/07/03" },
  { id: 3, name: "期末試験", createdAt: "2025/07/03" },
];
// 2. PDFファイル（子）のデータ
const sampleItems = [
  // カテゴリーID: 1 (課題資料) に紐づくデータ
  {
    categoryId: 1,
    title: "a",
    fileName: "0701課題資料.pdf",
    createdAt: "2025/07/01",
    fileUrl: "/files/kadai1.pdf",
    materialId: 1,
  },
  {
    categoryId: 1,
    title: "a",
    fileName: "0703課題資料.pdf",
    createdAt: "2025/07/03",
    fileUrl: "/files/kadai2.pdf",
    materialId: 2,
  },

  // カテゴリーID: 2 (授業資料) に紐づくデータ
  {
    categoryId: 2,
    title: "a",
    fileName: "0701授業資料.pdf",
    createdAt: "2025/07/01",
    fileUrl: "/files/lesson1.pdf",
    materialId: 3,
  },
];

const Material = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

<<<<<<< HEAD
=======
  const location = useLocation();
  const state = location.state as ClassData | null;

  const classData = state || {
    name: "エラー",
    description: "データが見つかりませんでした。再度選択してください。",
  };

>>>>>>> 8111413 (refactor:レビュー内容の修正。)
  return (
    <div className={styles.materialLayout}>
      <div className={styles.materialContainer}>
        <div className={styles.materialMain}>
          <div className={styles.feedWrapper}>
            <button onClick={modalButtonClick} className={styles.modalButton}>
              <div>
                <RiCompass3Line />
              </div>
            </button>
            <div className={styles.headerArea}>
              <h1>{classData.name}</h1>
              <p>{classData.description}</p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.cardList}>
              {sampleItems.map((item) => (
                <MaterialCard key={item.materialId} item={item} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.materialSub}>
          <InfoBox>
            <MaterialCategory
              categories={sampleCategories}
              items={sampleItems}
            />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          <MaterialCategory categories={sampleCategories} items={sampleItems} />
        </InfoBox>
      </Modal>
    </div>
  );
};

export default Material;
