import { PostBox } from "@/components/ui/postBox/postBox";
import { type PostData } from "@/features/post/types/post";

const dummyPostData: PostData[] = [
  {
    postId: "2",
    userId: 1,
    postDate: "2024-12-08T12:30:00",
    sentence: "あああああああああああああああああああああああああああああああ",
    likeCount: 5,
    responseCount: 0,
    shareRange: [1],
    nickname: "dummy_user_01",
    showUserId: "dummy_user_01",
    icon: "https://placehold.co/100x100/blue/white?text=D",
    isLiked: false,
    isBookmarked: false,
  },
  {
    postId: "3",
    userId: 1,
    postDate: "2024-12-08T11:30:00",
    sentence: "なまたまごは飲み物",
    likeCount: 25,
    responseCount: 4,
    shareRange: [1],
    nickname: "dummy_user_01",
    showUserId: "dummy_user_01",
    icon: "https://placehold.co/100x100/blue/white?text=D",
    isLiked: true,
    isBookmarked: true,
    imageUrl: [],
  },
  {
    postId: "4",
    userId: 1,
    postDate: "2024-12-08T10:30:00",
    sentence: "♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪♪",
    likeCount: 0,
    responseCount: 1,
    shareRange: [1],
    nickname: "dummy_user_01",
    showUserId: "dummy_user_01",
    icon: "https://placehold.co/100x100/blue/white?text=D",
    isLiked: false,
    isBookmarked: false,
  },
  {
    postId: "5",
    userId: 1,
    postDate: "2024-12-08T09:30:00",
    sentence: "タツノオトシゴ",
    likeCount: 100,
    responseCount: 12,
    shareRange: [1],
    nickname: "dummy_user_01",
    showUserId: "dummy_user_01",
    icon: "https://placehold.co/100x100/blue/white?text=D",
    isLiked: true,
    isBookmarked: true,
    imageUrl: [
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
    ],
  },
];

const ProfileResponses = () => {
  return (
    <>
      {dummyPostData.map((post) => (
        <PostBox key={post.postId} {...post} />
      ))}
    </>
  );
};

export default ProfileResponses;
