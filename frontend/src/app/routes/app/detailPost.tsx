import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useResponses } from "@/features/post/hooks/useResponses";
import { Spinner } from "@/components/ui/spinner/spinner";

const DetailPost = () => {
  const { id } = useParams();
  const { data: responses, isFetching, isError } = useResponses(id);
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const location = useLocation();
  const postData = location.state?.item;

  if (!postData) {
    return (
      <div className={styles.timelineLayout}>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineMain}>
            <p>投稿情報を取得できませんでした。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.timelineLayout}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <PostBox {...postData} isLink={false} />
          <h3 className={styles.detailTag}>返信一覧</h3>
          {isFetching ? (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          ) : isError ? (
            <div className={styles.errorContainer}>
              <p>返信の取得に失敗しました。</p>
            </div>
          ) : responses && responses.length > 0 ? (
            responses.map((item) => <PostBox key={item.postId} {...item} />)
          ) : (
            <div className={styles.emptyContainer}>
              <p>まだ返信はありません。</p>
            </div>
          )}
        </div>
        <div className={styles.timelineSub}>
          <InfoBox>
            <TimelineFilter />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          <TimelineFilter />
        </InfoBox>
      </Modal>
    </div>
  );
};

export default DetailPost;
