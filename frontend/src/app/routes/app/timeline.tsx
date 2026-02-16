import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { Outlet } from "react-router";
import { Spinner } from "@/components/ui/spinner/spinner";
import { usePosts } from "@/features/post/hooks/usePosts";
import { useGroups } from "@/features/management/hooks/useGroups";

const Timeline = () => {
  const { data: posts, isFetching } = usePosts();
  const { groups } = useGroups();

  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  return (
    <div className={styles.timelineLayout}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          {isFetching ? (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          ) : posts ? (
            posts.map((item) => (
              <PostBox key={item.postId} props={{ ...item }} />
            ))
          ) : (
            []
          )}
        </div>
        <div className={styles.timelineSub}>
          <InfoBox>
            <TimelineFilter groups={groups} />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          <TimelineFilter groups={groups} />
        </InfoBox>
      </Modal>
      <Outlet />
    </div>
  );
};

export default Timeline;
