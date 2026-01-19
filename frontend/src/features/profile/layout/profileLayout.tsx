import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/layout/profileLayout.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { ProfileCard } from "../components/profileCard";
import { ProfileCardTab } from "../components/profileTab";
import type { profileCard } from "../types/profileTypes";
import { Outlet } from "react-router";

const dummyProfile: profileCard = {
  userId: "user-8823-v9p",
  userName: "サカバンバスピス",
  iconUrl:
    "https://www.sankei.com/resizer/v2/3P43OGHLUFBDNO6BED37J2RTPM.jpg?auth=54f463fd643ce84582d10a89b4392500c8ac357e9ac79bb92d50980d2225080a&quality=40&focal=593%2C440&width=1200",
  follow: 10,
  follower: 999999999,
  introduction:
    "深海魚です。趣味は某動画本社を爆破すること。本職は水族館勤務。タツノオトシゴが運営しています。",
};

const ProfileLayout = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };
  return (
    <div className={styles.profileLayout}>
      <div className={styles.profileContainer}>
        <div className={styles.profileMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <ProfileCard {...dummyProfile} />
          <ProfileCardTab />
          <Outlet />
        </div>
        <div className={styles.profileSub}>
          <InfoBox>
            <></>
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          <></>
        </InfoBox>
      </Modal>
    </div>
  );
};

export default ProfileLayout;
