import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router";
import { useResponses } from "@/features/post/hooks/useResponses";
import { Spinner } from "@/components/ui/spinner/spinner";
import { usePost } from "@/features/post/hooks/usePost";
import { useGroups } from "@/features/management/hooks/useGroups";

const DetailPost = () => {
  const { id } = useParams();
  const { groups } = useGroups();

  const {
    data: post,
    isFetching: isPostFetching,
    isError: isPostError,
  } = usePost(id);

  const {
    data: responses,
    isFetching: isResponsesFetching,
    isError: isResponsesError,
  } = useResponses(id);

  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const location = useLocation();
  const shouldScrollToLatestResponse =
    location.hash === "#latest-response" ||
    Boolean(
      (location.state as { scrollToLatestResponse?: boolean } | null)
        ?.scrollToLatestResponse,
    );

  const hasAutoScrolledRef = useRef(false);
  const firstResponseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!shouldScrollToLatestResponse) return;
    if (hasAutoScrolledRef.current) return;
    if (isResponsesFetching || isResponsesError) return;

    if (responses && responses.length > 0) {
      firstResponseRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    hasAutoScrolledRef.current = true;
  }, [
    shouldScrollToLatestResponse,
    isResponsesFetching,
    isResponsesError,
    responses,
  ]);

  if (isPostError) {
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

  if (isPostFetching) {
    return (
      <div className={styles.timelineLayout}>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineMain}>
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
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
          <PostBox {...post} isLink={false} />

          <h3 className={styles.detailTag}>返信一覧</h3>

          {isResponsesFetching ? (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          ) : isResponsesError ? (
            <div className={styles.errorContainer}>
              <p>返信の取得に失敗しました。</p>
            </div>
          ) : responses && responses.length > 0 ? (
            responses.map((item, index) => (
              <div
                key={item.postId}
                ref={index === 0 ? firstResponseRef : null}
              >
                <PostBox {...item} />
              </div>
            ))
          ) : (
            <div className={styles.emptyContainer}>
              <p>まだ返信はありません。</p>
            </div>
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
    </div>
  );
};

export default DetailPost;
