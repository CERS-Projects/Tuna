import { Header } from "@/components/ui/header/header";
import { InfoBox } from "@/components/ui/infoBox/infoBox";
import {
  SearchFilter,
  type NodeItem,
} from "@/features/search/components/searchFilter";
import { Menu } from "@/features/timeline/components/menu/menu";
import styles from "@/features/search/styles/searchPost.module.css";
import { useRef } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { RiCompass3Line } from "react-icons/ri";
import { SearchHistory } from "@/features/search/components/searchHistory";

const exampleFlatData: NodeItem[] = [
  { id: 1, name: "a", classid: 0 },
  { id: 2, name: "b", classid: 1 },
  { id: 3, name: "c", classid: 1 },
  { id: 4, name: "d", classid: 2 },
  { id: 5, name: "e", classid: 2 },
  { id: 6, name: "a", classid: 3 },
  { id: 7, name: "b", classid: 5 },
  { id: 8, name: "c", classid: 6 },
  { id: 9, name: "d", classid: 1 },
  { id: 10, name: "e", classid: 9 },
];

const SearchPost = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };
  return (
    <div className={styles.searchPostLayout}>
      <Header />
      <div className={styles.searchPostContainer}>
        <div className={styles.searchPostAreaLeft}>
          <Menu />
        </div>
        <div className={styles.searchPostAreaCenter}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <div className={styles.searchBarContainer}>
            <SearchHistory />
          </div>
        </div>
        <div className={styles.searchPostAreaRight}>
          <InfoBox>
            <SearchFilter flatData={exampleFlatData} />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"90%"} width={"90%"}>
        <InfoBox>
          <SearchFilter flatData={exampleFlatData} />
        </InfoBox>
      </Modal>
    </div>
  );
};

export default SearchPost;
