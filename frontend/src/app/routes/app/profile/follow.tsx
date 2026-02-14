import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/styles/follow.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { FollowCard } from "@/features/profile/components/followCard/followCard";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useFollowing } from "@/features/profile/hooks/useFollowing";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useUser } from "@/features/auth/hooks/useUser";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { useNotice } from "@/features/profile/hooks/useNotice";

const Follow = () => {
  const { data: following, isLoading, isError } = useFollowing();
  const { authToken } = useAuth();
  const { data: loginUser } = useUser(authToken);

  const {
    data: notice,
    isLoading: isNoticeLoading,
    isError: isNoticeError,
  } = useNotice();

  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  return (
    <div className={styles.followLayout}>
      <div className={styles.followContainer}>
        <div className={styles.followMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <div className={styles.followHeader}>
            <h2>フォロー</h2>
          </div>
          <hr />
          {isError ? (
            <p>フォローユーザ一覧の取得に失敗しました</p>
          ) : isLoading ? (
            <Spinner />
          ) : following && following.length > 0 ? (
            following.map((user) => (
              <FollowCard
                key={user.showUserId}
                {...user}
                isMyself={user.showUserId === loginUser?.showUserId}
              />
            ))
          ) : (
            <p>フォローしているユーザがいません</p>
          )}
        </div>
        <div className={styles.followSub}>
          <InfoBox>
            {isNoticeError ? (
              <p>おしらせの取得に失敗しました</p>
            ) : isNoticeLoading ? (
              <Spinner />
            ) : notice && notice.length > 0 ? (
              <NoticeInfo notices={notice} />
            ) : null}
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
          ) : null}
        </InfoBox>
      </Modal>
    </div>
  );
};

export default Follow;
