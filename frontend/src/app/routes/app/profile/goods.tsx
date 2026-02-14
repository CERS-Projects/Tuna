import { PostBox } from "@/components/ui/postBox/postBox";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useUserGood } from "@/features/profile/hooks/useUserGood";
import { useOutletContext } from "react-router";
import { type ProfileContext } from "@/features/profile/layout/profileLayout";

const ProfileGoods = () => {
  const { userId } = useOutletContext<ProfileContext>();
  const { data: posts, isLoading, isError } = useUserGood(userId);

  return (
    <>
      {isError ? (
        <p>いいね投稿の取得に失敗しました</p>
      ) : isLoading ? (
        <Spinner />
      ) : (
        posts?.map((post) => <PostBox key={post.postId} {...post} />)
      )}
    </>
  );
};

export default ProfileGoods;
