import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";

type PostDataItem = {
  postId: number;
  showUserId: string;
  userName: string;
  iconUrl?: string;
  mainPost: string;
  goodCount: number;
  commentCount: number;
  goodCheck: boolean;
  bookmarkCheck: boolean;
  postTo: string;
  userTo: string;
  postImgs?: string[];
};

const PostDummy: PostDataItem[] = [
  {
    postId: 1,
    showUserId: "u001",
    userName: "田中 太郎",
    iconUrl: "https://placehold.co/100x100/orange/white?text=T",
    mainPost:
      "今日のランチは駅前の新しいカフェに行きました！パスタが絶品でした🍝 #ランチ #カフェ",
    goodCount: 120,
    commentCount: 5,
    goodCheck: true,
    bookmarkCheck: false,
    postTo: "2024/12/08 12:30",
    userTo: "@tanaka_taro",
    postImgs: [
      "https://placehold.co/600x400/skyblue/white?text=Pasta+Image",
      "https://placehold.co/600x400/pink/white?text=Cafe+Interior",
    ],
  },
  {
    postId: 2,
    showUserId: "u002",
    userName: "エンジニア見習い",
    iconUrl: "https://placehold.co/100x100/333/white?text=Dev",
    mainPost:
      "Reactのレンダリングの仕組みがいまいち掴めない...。誰か詳しい人教えてください！🤔",
    goodCount: 8,
    commentCount: 12,
    goodCheck: false,
    bookmarkCheck: true,
    postTo: "2024/12/08 10:15",
    userTo: "@dev_beginner",
    // 画像なしパターン
  },
  {
    postId: 3,
    showUserId: "u003",
    userName: "Traveler J",
    // iconUrlなしパターン（デフォルトアイコン表示のテスト用）
    mainPost:
      "やっと週末！今から温泉旅行に行ってきます♨️ 雪景色が見られるといいな。",
    goodCount: 342,
    commentCount: 0,
    goodCheck: true,
    bookmarkCheck: true,
    postTo: "2024/12/07 18:00",
    userTo: "@travel_lover",
    postImgs: ["https://placehold.co/600x400/teal/white?text=Train+View"],
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
    <div className={styles.timelineLayout}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          {PostDummy.map((item) => (
            <PostBox
              postId={item.postId}
              showUserId={item.showUserId}
              userName={item.userName}
              iconUrl={item.iconUrl}
              mainPost={item.mainPost}
              goodCount={item.goodCount}
              commentCount={item.commentCount}
              goodCheck={item.goodCheck}
              bookmarkCheck={item.bookmarkCheck}
              postTo={item.postTo}
              userTo={item.userTo}
              postImgs={item.postImgs}
            />
          ))}
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

export default Timeline;
