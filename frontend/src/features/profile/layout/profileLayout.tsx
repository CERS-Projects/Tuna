import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/profile/layout/profileLayout.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { ProfileCard } from "../components/profileCard";
import { OtherProfileCard } from "../components/otherProfileCard";
import { ProfileCardTab } from "../components/profileTab";
import { Outlet } from "react-router";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { type NoticeInfoItem } from "@/features/searchClassroom/types/SelectClassroom";
import { useProfile } from "../hooks/useProfile";
import { type User } from "@/types/user";
import { type ProfileData } from "../types/profileTypes";
import { Spinner } from "@/components/ui/spinner/spinner";

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

export type ProfileContext = {
  userId: number | undefined;
};

const ProfileLayout = () => {
  const modalRef = useRef<ModalHandle>(null);
  const { data: profile, isMyProfile, isPending, isError } = useProfile();

  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  return (
    <div className={styles.profileLayout}>
      <div className={styles.profileContainer}>
        {!isError ? (
          <div className={styles.profileMain}>
            <button onClick={modalButtonClick} className={styles.modalButton}>
              <RiCompass3Line />
            </button>

            {isPending ? (
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
