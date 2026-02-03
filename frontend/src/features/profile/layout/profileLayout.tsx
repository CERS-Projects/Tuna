import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/layout/profileLayout.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef, useState } from "react";
import { ProfileCard } from "../components/profileCard";
import { OtherProfileCard } from "../components/otherProfileCard";
import { ProfileCardTab } from "../components/profileTab";
import type { ProfileData } from "../types/profileTypes";
import { Outlet, useParams } from "react-router";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { type NoticeInfoItem } from "@/features/searchClassroom/types/SelectClassroom";

const dummyProfile: ProfileData = {
  showUserId: "user-8823-v9p",
  userName: "サカバンバスピス",
  iconUrl:
    "https://www.sankei.com/resizer/v2/3P43OGHLUFBDNO6BED37J2RTPM.jpg?auth=54f463fd643ce84582d10a89b4392500c8ac357e9ac79bb92d50980d2225080a&quality=40&focal=593%2C440&width=1200",
  follow: 10,
  follower: 999999999,
  introduction:
    "深海魚です。趣味は某動画本社を爆破すること。本職は水族館勤務。タツノオトシゴが運営しています。",
};

const dummyOtherProfile: ProfileData = {
  showUserId: "other-user-001",
  userName: "別のユーザー",
  iconUrl: "",
  follow: 50,
  follower: 120,
  introduction: "こちらは他のユーザーのプロフィール画面のテストです。",
};

const dummyInfo: NoticeInfoItem[] = [
  {
    noticeId: 1,
    groupId: 101,
    noticeTitle: "【重要】明日の時間割変更について",
    noticeContent:
      "明日の3限と4限が入れ替わります。各自、教科書の忘れ物がないように注意してください。",
    noticeDate: "2024-03-25",
    teacherName: "佐藤 健二",
  },
  {
    noticeId: 2,
    groupId: 102,
    noticeTitle: "春季講習の申し込み受付開始",
    noticeContent:
      "来月の春季講習の受付を開始しました。マイページより希望する科目を選択して申し込んでください。",
    noticeDate: "2024-03-24",
    teacherName: "田中 美咲",
  },
  {
    noticeId: 3,
    groupId: 101,
    noticeTitle: "数学の中間テスト範囲について",
    noticeContent:
      "来週のテスト範囲は教科書P.45〜P.80までとなります。問題集も並行して進めておいてください。",
    noticeDate: "2024-03-22",
    teacherName: "佐藤 健二",
  },
  {
    noticeId: 4,
    groupId: 105,
    noticeTitle: "忘れ物のお知らせ（筆箱）",
    noticeContent:
      "3階の自習室に青色の筆箱の忘れ物がありました。心当たりのある人は受付まで来てください。",
    noticeDate: "2024-03-21",
    teacherName: "事務局",
  },
  {
    noticeId: 5,
    groupId: 103,
    noticeTitle: "英検二次試験対策講座の案内",
    noticeContent:
      "二次試験に進む生徒を対象に、面接対策の特別講座を実施します。参加希望者は担当まで。",
    noticeDate: "2024-03-20",
    teacherName: "高橋 浩一",
  },
];

const ProfileLayout = () => {
  const modalRef = useRef<ModalHandle>(null);
  const { userId } = useParams();

  const myUserId = "user-8823-v9p";

  const isMyProfile = !userId || userId === myUserId;

  const [isFollowing, setIsFollowing] = useState(false);

  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className={styles.profileLayout}>
      <div className={styles.profileContainer}>
        <div className={styles.profileMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>

          {isMyProfile ? (
            <ProfileCard {...dummyProfile} />
          ) : (
            <OtherProfileCard
              {...dummyOtherProfile}
              isFollowing={isFollowing}
              isFollowedBy={true}
              onToggleFollow={handleToggleFollow}
            />
          )}

          <ProfileCardTab isMyProfile={isMyProfile} />
          <Outlet />
        </div>
        <div className={styles.profileSub}>
          <InfoBox>
            <NoticeInfo items={dummyInfo} />
          </InfoBox>
        </div>
      </div>
      <Modal ref={modalRef} height={"fit-content"} width={"fit-content"}>
        <InfoBox>
          <NoticeInfo items={dummyInfo} />
        </InfoBox>
      </Modal>
    </div>
  );
};

export default ProfileLayout;
