import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { useLocation } from "react-router";
import { type PostData } from "@/features/post/types/post";

const dummyReply: PostData[] = [
  {
    postId: "1001",
    userId: 101,
    postDate: "2024-05-10T14:00:00",
    sentence: "この実装方法、非常にスマートで勉強になります！",
    likeCount: 5,
    responseCount: 1,
    shareRange: [1],
    nickname: "エンジニアA",
    showUserId: "user_a1",
    icon: "https://placehold.co/100x100/blue/white?text=A",
    isLiked: true,
    isBookmarked: false,
  },
  {
    postId: "1002",
    userId: 102,
    postDate: "2024-05-10T14:15:00",
    sentence:
      "色使いがとても綺麗ですね。補足ですが、アクセシビリティの観点からコントラスト比をもう少し上げるとさらに良くなるかもしれません。",
    likeCount: 12,
    responseCount: 3,
    shareRange: [1],
    nickname: "デザイナーB",
    showUserId: "user_b2",
    icon: "https://placehold.co/100x100/pink/white?text=B",
    isLiked: false,
    isBookmarked: true,
    imageUrl: ["https://via.placeholder.com/600x400"],
  },
  {
    postId: "1003",
    userId: 103,
    postDate: "2024-05-10T15:30:00",
    sentence:
      "自分も以前同じところで詰まりました。解決策を共有してくれて助かります！",
    likeCount: 2,
    responseCount: 0,
    shareRange: [1],
    nickname: "佐藤",
    showUserId: "user_c3",
    icon: "https://placehold.co/100x100/gray/white?text=S",
    isLiked: false,
    isBookmarked: false,
  },
  {
    postId: "1004",
    userId: 104,
    postDate: "2024-05-10T16:05:00",
    sentence: "これって、最新のライブラリでも動作しますか？",
    likeCount: 0,
    responseCount: 1,
    shareRange: [1],
    nickname: "田中",
    showUserId: "user_d4",
    icon: "https://placehold.co/100x100/green/white?text=T",
    isLiked: false,
    isBookmarked: false,
  },
  {
    postId: "1005",
    userId: 105,
    postDate: "2024-05-10T17:00:00",
    sentence: "関連する資料のスクリーンショットを添付します。参考にどうぞ。",
    likeCount: 8,
    responseCount: 2,
    shareRange: [1],
    nickname: "Tech Lover",
    showUserId: "user_e5",
    icon: "https://placehold.co/100x100/purple/white?text=TL",
    isLiked: true,
    isBookmarked: true,
  },
];

const DetailPost = () => {
  const modalRef = useRef<ModalHandle>(null);
  const modalButtonClick = () => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  const location = useLocation();
  const postData = location.state?.item;

  if (!postData) {
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
          <PostBox {...postData} isLink={false} />
          <h3 className={styles.detailTag}>返信一覧</h3>
          {dummyReply.map((item) => (
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
    </div>
  );
};

export default DetailPost;
