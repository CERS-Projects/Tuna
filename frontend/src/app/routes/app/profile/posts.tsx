import { PostBox } from "@/components/ui/postBox/postBox";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useUserPost } from "@/features/profile/hooks/useUserPost";
import { type ProfileContext } from "@/features/profile/layout/profileLayout";
import { useOutletContext } from "react-router";

const ProfilePosts = () => {
  const { userId } = useOutletContext<ProfileContext>();
  const { data: posts, isLoading, isError } = useUserPost(userId);

  return (
    <>
      {isError ? (
        <p>ユーザ投稿の取得に失敗しました</p>
      ) : isLoading ? (
        <Spinner />
      ) : (
        posts?.map((post) => <PostBox key={post.postId} {...post} />)
      )}
    </>
  );
};

export default ProfilePosts;
