import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/layout/profileLayout.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { ProfileCard } from "../components/profileCard/profileCard";
import { OtherProfileCard } from "../components/profileCard/otherProfileCard";
import { ProfileCardTab } from "../components/profileTab/profileTab";
import { Outlet } from "react-router";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { useProfile } from "../hooks/useProfile";
import { type User } from "@/types/user";
import { type ProfileData } from "../types/profileTypes";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useNotice } from "../hooks/useNotice";

export type ProfileContext = {
  userId: number | undefined;
};

const ProfileLayout = () => {
  const modalRef = useRef<ModalHandle>(null);
  const {
    data: profile,
    isMyProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();
  const {
    data: notice,
    isLoading: isNoticeLoading,
    isError: isNoticeError,
  } = useNotice();

  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  return (
    <div className={styles.profileLayout}>
      <div className={styles.profileContainer}>
        {!isProfileError ? (
          <div className={styles.profileMain}>
            <button onClick={modalButtonClick} className={styles.modalButton}>
              <RiCompass3Line />
            </button>

            {isProfileLoading ? (
              <Spinner />
            ) : profile && isMyProfile ? (
              <ProfileCard {...(profile as User)} />
            ) : profile && !isMyProfile ? (
              <OtherProfileCard {...(profile as ProfileData)} />
            ) : null}

            <ProfileCardTab isMyProfile={isMyProfile} />
            <Outlet context={{ userId: profile?.userId }} />
          </div>
        ) : (
          <>ユーザ情報の取得に失敗しました</>
        )}

        <div className={styles.profileSub}>
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

export default ProfileLayout;
