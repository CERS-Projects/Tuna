import { PostBox } from "@/components/ui/postBox/postBox";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useUserBookmark } from "@/features/profile/hooks/useUserBookmark";
import { type ProfileContext } from "@/features/profile/layout/profileLayout";
import { useOutletContext } from "react-router";

const ProfileBookmarks = () => {
  const { userId } = useOutletContext<ProfileContext>();
  const { data: posts, isPending, isError } = useUserBookmark(userId);

  return (
    <>
      {isError ? (
        <p>ユーザ投稿の取得に失敗しました</p>
      ) : isPending ? (
        <Spinner />
      ) : (
        posts?.map((post) => <PostBox key={post.postId} {...post} />)
      )}
    </>
  );
};

export default ProfileBookmarks;
