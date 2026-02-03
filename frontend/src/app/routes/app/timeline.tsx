import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { Outlet } from "react-router";
import { type PostData } from "@/features/post/types/post";

const PostDummy: PostData[] = [
  {
    postId: "1",
    userId: 1,
    postDate: "2024-12-08T12:30:00",
    sentence:
      "今日のランチは駅前の新しいカフェに行きました！パスタが絶品でした🍝 #ランチ #カフェ",
    likeCount: 120,
    responseCount: 5,
    shareRange: [1, 2],
    nickname: "田中 太郎",
    showUserId: "u001",
    icon: "https://placehold.co/100x100/orange/white?text=T",
    isLiked: true,
    isBookmarked: false,
    imageUrl: [
      "https://placehold.co/600x400/skyblue/white?text=Pasta+Image",
      "https://placehold.co/600x400/pink/white?text=Cafe+Interior",
    ],
  },
  {
    postId: "2",
    userId: 2,
    postDate: "2024-12-08T10:15:00",
    sentence:
      "Reactのレンダリングの仕組みがいまいち掴めない...。誰か詳しい人教えてください！🤔",
    likeCount: 8,
    responseCount: 12,
    shareRange: [1],
    nickname: "エンジニア見習い",
    showUserId: "u002",
    icon: "https://placehold.co/100x100/333/white?text=Dev",
    isLiked: false,
    isBookmarked: true,
    // 画像なしパターン
  },
  {
    postId: "3",
    userId: 3,
    postDate: "2024-12-07T18:00:00",
    sentence:
      "やっと週末！今から温泉旅行に行ってきます♨️ 雪景色が見られるといいな。",
    likeCount: 342,
    responseCount: 0,
    shareRange: [1, 2, 3],
    nickname: "Traveler J",
    showUserId: "u003",
    icon: "https://placehold.co/100x100/gray/white?text=T",
    isLiked: true,
    isBookmarked: true,
    imageUrl: ["https://placehold.co/600x400/teal/white?text=Train+View"],
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
            <PostBox key={item.postId} {...item} />
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
      <Outlet />
    </div>
  );
};

export default Timeline;
