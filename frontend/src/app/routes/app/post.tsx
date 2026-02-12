import { PostCreateModal } from "@/features/post/components/postCreate/postCreate";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { type ModalHandle } from "@/components/ui/modal/modal";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGroups } from "@/features/management/hooks/useGroups";

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<ModalHandle>(null);

  const { authToken } = useAuth();
  const { data: user } = useUser(authToken);
  const { groups } = useGroups();

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  }, []);

  const handleCloseTrigger = () => {
    navigate(-1);
  };

  return (
    <PostCreateModal
      ref={modalRef}
      user={user}
      groups={groups}
      onClose={handleCloseTrigger}
      response={location.state}
    />
  );
};

export default Post;
