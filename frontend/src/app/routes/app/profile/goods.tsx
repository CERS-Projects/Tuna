import { PostBox } from "@/components/ui/postBox/postBox";
import type { PostData } from "@/components/ui/postBox/types/postBox";

const dummyPostData: PostData[] = [
  {
    postId: 2,
    userId: "dummy_user_01",
    userName: "dummy_user_01",
    mainPost: "あああああああああああああああああああああああああああああああ",
    goodCount: 5,
    commentCount: 0,
    goodCheck: false,
    bookmarkCheck: false,
    postTo: "public",
    userTo: "none",
  },
  {
    postId: 3,
    userId: "dummy_user_01",
    userName: "dummy_user_01",
    mainPost: "なまたまごは飲み物",
    goodCount: 25,
    commentCount: 4,
    goodCheck: true,
    bookmarkCheck: true,
    postTo: "tech",
    userTo: "developer_team",
    postImgs: [],
  },
  {
    postId: 4,
    userId: "dummy_user_01",
    userName: "dummy_user_01",
    mainPost: "♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪",
    goodCount: 0,
    commentCount: 1,
    goodCheck: false,
    bookmarkCheck: false,
    postTo: "feedback",
    userTo: "admin",
  },
  {
    postId: 5,
    userId: "dummy_user_01",
    userName: "dummy_user_01",
    mainPost: "タツノオトシゴ",
    goodCount: 100,
    commentCount: 12,
    goodCheck: true,
    bookmarkCheck: true,
    postTo: "announcement",
    userTo: "all",
    postImgs: [
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
    ],
  },
];

const ProfileGoods = () => {
  return (
    <>
      {dummyPostData.map((post) => (
        <PostBox key={post.postId} {...post} />
      ))}
    </>
  );
};

export default ProfileGoods;
