import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { SelectClassroom } from "@/features/searchClassroom/components/selectClassroom";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/searchClassroom/styles/searchClassroom.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { NoticeInfo } from "@/features/searchClassroom/components/noticeInfo";
import { SearchBar } from "@/components/ui/search/search";
import { useState } from "react";
import type {
  Classroom,
  NoticeInfoItem,
} from "@/features/searchClassroom/types/SelectClassroom";

const dummyClass: Classroom[] = [
  {
    roomId: 101,
    teacherName: "佐藤 健一",
    roomName: "1-A 算数教室",
    description:
      "基礎からじっくり学ぶ算数のクラスです。現在は分数と小数を中心に学習しています。",
    latestUpdate: "2026-01-05 10:30:00",
  },
  {
    roomId: 102,
    teacherName: "田中 美咲",
    roomName: "2-B 英語ルーム",
    description:
      "ネイティブ講師を招いた英会話中心の授業。楽しく話すことを目標にしています。",
    latestUpdate: "2026-01-06 09:15:22",
  },
  {
    roomId: 205,
    teacherName: "Robert Smith",
    roomName: "Science Lab 1",
    description:
      "化学反応の実験をメインに行う理科室です。安全メガネの着用を忘れずに。",
    latestUpdate: "2025-12-25 16:45:10",
  },
  {
    roomId: 303,
    teacherName: "鈴木 裕子",
    roomName: "3-C 国語演習",
    description:
      "現代文の読解力を深めます。今週は芥川龍之介の短編を読んでいます。",
    latestUpdate: "2026-01-04 14:00:00",
  },
  {
    roomId: 401,
    teacherName: "高橋 浩二",
    roomName: "プログラミング基礎",
    description:
      "TypeScriptとReactを使ったWebアプリ制作の基礎を学ぶ短期集中コースです。",
    latestUpdate: "2026-01-02 11:20:45",
  },
  {
    roomId: 502,
    teacherName: "伊藤 舞",
    roomName: "アート・デザイン",
    description:
      "色彩感覚を磨くデッサンの時間です。今週は静物画に取り組んでいます。",
    latestUpdate: "2026-01-06 08:05:12",
  },
];

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

const SearchClassroom = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const [query, setQuery] = useState<string>("");
  const [searchClassroom, setSearchClassroom] =
    useState<typeof dummyClass>(dummyClass);

  const handleSearch = () => {
    if (!query.trim()) {
      setSearchClassroom(dummyClass);
      return;
    }

    const filteredClassrooms = dummyClass.filter((classroom) =>
      classroom.roomName.toLowerCase().includes(query.toLowerCase())
    );

    setSearchClassroom(filteredClassrooms);
  };

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
              onChange={(e) => {
                const nextValue = e.target.value;
                setQuery(nextValue);
                if (!nextValue.trim()) {
                  setSearchClassroom(dummyClass);
                }
              }}
              onSearch={handleSearch}
            />
          </div>
          <div className={styles.mainBottom}>
            {searchClassroom.length > 0 ? (
              searchClassroom.map((classroom) => (
                <SelectClassroom key={classroom.roomId} {...classroom} />
              ))
            ) : (
              <p>該当する教室が見つかりませんでした。</p>
            )}
          </div>
        </div>
        <div className={styles.searchClassroomSub}>
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

export default SearchClassroom;
