import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/styles/follow.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { type followData } from "@/features/profile/types/profileTypes";
import { FollowCard } from "@/features/profile/components/followCard";

const dummyFollowers: followData[] = [
  {
    userId: 1,
    showUserId: "tanaka_tech",
    userName: "リュウグウノツカイ",
    iconUrl: "https://loremflickr.com/150/150/deepseafish?random=1",
    isFollowed: true,
    isFollowing: false,
  },
  {
    userId: 2,
    showUserId: "yuki_design",
    userName: "デメニギス",
    iconUrl: "https://loremflickr.com/150/150/deepseafish?random=2",
    isFollowed: true,
    isFollowing: true,
  },
  {
    userId: 3,
    showUserId: "long_name_user_test_account_example",
    userName: "ミツクリザメ",
    iconUrl: "https://loremflickr.com/150/150/deepseafish?random=3",
    isFollowed: false,
    isFollowing: false,
  },
  {
    userId: 4,
    showUserId: "react_lover",
    userName: "チョウチンアンコウ",
    iconUrl: "https://loremflickr.com/150/150/deepseafish?random=4",
    isFollowed: true,
    isFollowing: false,
  },
  {
    userId: 5,
    showUserId: "no_image_user",
    userName: "フクロウナギ",
    iconUrl: "https://loremflickr.com/150/150/deepseafish?random=5",
    isFollowed: false,
    isFollowing: true,
  },
];

const Timeline = () => {
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
          {dummyFollowers.map((user) => (
            <FollowCard key={user.showUserId} {...user} />
          ))}
        </div>
        <div className={styles.followSub}>
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

export default Timeline;
