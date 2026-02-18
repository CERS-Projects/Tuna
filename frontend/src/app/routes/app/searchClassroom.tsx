import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { SelectClassroom } from "@/features/searchClassroom/components/selectClassroom";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/searchClassroom/styles/searchClassroom.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef, useMemo } from "react";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { SearchBar } from "@/components/ui/search/search";
import { useClassrooms } from "@/features/searchClassroom/hooks/useClassrooms";
import { useState } from "react";
import { useNotice } from "@/features/profile/hooks/useNotice";
import { Spinner } from "@/components/ui/spinner/spinner";

const SearchClassroom = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const [query, setQuery] = useState<string>("");
  const { data: classrooms = [], isFetching, isError } = useClassrooms();

  const {
    data: notice,
    isLoading: isNoticeLoading,
    isError: isNoticeError,
  } = useNotice();

  const filteredClassrooms = useMemo(() => {
    if (!query.trim()) return classrooms;
    return classrooms.filter((classroom) =>
      classroom.roomName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [classrooms, query]);

  return (
    <div className={styles.searchClassroomLayout}>
      <div className={styles.searchClassroomContainer}>
        <div className={styles.searchClassroomMain}>
          <div className={styles.mainTop}>
            <button onClick={modalButtonClick} className={styles.modalButton}>
              <RiCompass3Line />
            </button>
            <SearchBar
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onSearch={() => {}}
            />
          </div>
          <div className={styles.mainBottom}>
            {isFetching ? (
              <p>読み込み中...</p>
            ) : isError ? (
              <p>教室の取得に失敗しました。</p>
            ) : filteredClassrooms.length > 0 ? (
              filteredClassrooms.map((classroom) => (
                <SelectClassroom key={classroom.roomId} {...classroom} />
              ))
            ) : (
              <p>該当する教室が見つかりませんでした。</p>
            )}
          </div>
        </div>
        <div className={styles.searchClassroomSub}>
          <InfoBox>
            {isNoticeError ? (
              <p>おしらせの取得に失敗しました</p>
            ) : isNoticeLoading ? (
              <Spinner />
            ) : notice && notice.length > 0 ? (
              <NoticeInfo notices={notice} />
            ) : (
              <NoticeInfo notices={[]} />
            )}
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          {isNoticeError ? (
            <p>おしらせの取得に失敗しました</p>
          ) : isNoticeLoading ? (
            <Spinner />
          ) : notice && notice.length > 0 ? (
            <NoticeInfo notices={notice} />
          ) : (
            <NoticeInfo notices={[]} />
          )}
        </InfoBox>
      </Modal>
    </div>
  );
};

export default SearchClassroom;
