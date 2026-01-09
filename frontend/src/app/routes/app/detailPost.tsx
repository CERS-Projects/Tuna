import { InfoBox } from "@/components/ui/infoBox/infoBox";
import { TimelineFilter } from "@/features/timeline/components/timelineFilter/timelineFilter";
import { PostBox } from "@/components/ui/postBox/postBox";
import { RiCompass3Line } from "react-icons/ri";
import styles from "@/features/timeline/styles/timeline.module.css";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { useRef } from "react";
import { useLocation } from "react-router";

type PostDataItem = {
  postId: number;
  userId: string;
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
  responseTo?: number;
};

const dummyReply: PostDataItem[] = [
  {
    postId: 1001,
    userId: "user_a1",
    userName: "エンジニアA",
    iconUrl: "https://via.placeholder.com/150",
    mainPost: "この実装方法、非常にスマートで勉強になります！",
    goodCount: 5,
    commentCount: 1,
    goodCheck: true,
    bookmarkCheck: false,
    postTo: "2024-05-10 14:00",
    userTo: "@original_poster",
    responseTo: 999,
  },
  {
    postId: 1002,
    userId: "user_b2",
    userName: "デザイナーB",
    iconUrl: "https://via.placeholder.com/150",
    mainPost:
      "色使いがとても綺麗ですね。補足ですが、アクセシビリティの観点からコントラスト比をもう少し上げるとさらに良くなるかもしれません。",
    goodCount: 12,
    commentCount: 3,
    goodCheck: false,
    bookmarkCheck: true,
    postTo: "2024-05-10 14:15",
    userTo: "@original_poster",
    postImgs: ["https://via.placeholder.com/600x400"],
    responseTo: 999,
  },
  {
    postId: 1003,
    userId: "user_c3",
    userName: "佐藤",
    // iconUrlなし
    mainPost:
      "自分も以前同じところで詰まりました。解決策を共有してくれて助かります！",
    goodCount: 2,
    commentCount: 0,
    goodCheck: false,
    bookmarkCheck: false,
    postTo: "2024-05-10 15:30",
    userTo: "@original_poster",
    responseTo: 999,
  },
  {
    postId: 1004,
    userId: "user_d4",
    userName: "田中",
    iconUrl: "https://via.placeholder.com/150",
    mainPost: "これって、最新のライブラリでも動作しますか？",
    goodCount: 0,
    commentCount: 1,
    goodCheck: false,
    bookmarkCheck: false,
    postTo: "2024-05-10 16:05",
    userTo: "@original_poster",
    responseTo: 999,
  },
  {
    postId: 1005,
    userId: "user_e5",
    userName: "Tech Lover",
    iconUrl: "https://via.placeholder.com/150",
    mainPost: "関連する資料のスクリーンショットを添付します。参考にどうぞ。",
    goodCount: 8,
    commentCount: 2,
    goodCheck: true,
    bookmarkCheck: true,
    postTo: "2024-05-10 17:00",
    userTo: "@original_poster",
    postImgs: [
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400",
    ],
    responseTo: 999,
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
  const userInfo = location.state?.userInfo;

  return (
    <div className={styles.timelineLayout}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineMain}>
          <button onClick={modalButtonClick} className={styles.modalButton}>
            <RiCompass3Line />
          </button>
          <PostBox {...postData} userInfo={userInfo} isLink={false} />
          <h3 className={styles.detailTag}>返信一覧</h3>
          {dummyReply.map((item) => (
            <PostBox
              postId={item.postId}
              userId={item.userId}
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

export default DetailPost;
