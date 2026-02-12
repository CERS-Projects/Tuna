import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { SearchFilter } from "@/features/search/components/searchFilter";
import styles from "@/features/search/styles/searchPost.module.css";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { RiCompass3Line } from "react-icons/ri";
import { SearchHistory } from "@/features/search/components/searchHistory";
import { useGroups } from "@/features/management/hooks/useGroups";

const SearchPost = () => {
  const { groups } = useGroups();
  const [searchParams] = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    const shareRange = searchParams.get("shareRange");
    if (!shareRange || shareRange === "0") return new Set<number>();
    return new Set(
      shareRange
        .split(",")
        .map(Number)
        .filter((n) => !Number.isNaN(n)),
    );
  });

  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };
  return (
    <div className={styles.searchPostLayout}>
      <div className={styles.searchPostContainer}>
        <div className={styles.searchPostMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <div className={styles.searchBarContainer}>
            <SearchHistory selectedIds={selectedIds} />
          </div>
        </div>
        <div className={styles.searchPostSub}>
          <InfoBox>
            <SearchFilter
              groups={groups}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"90%"} width={"90%"}>
        <InfoBox>
          <SearchFilter
            groups={groups}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </InfoBox>
      </Modal>
    </div>
  );
};

export default SearchPost;
