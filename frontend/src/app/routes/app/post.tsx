import { PostCreateModal } from "@/features/post/components/postCreate/postCreate";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { type ModalHandle } from "@/components/ui/modal/modal";

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<ModalHandle>(null);

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
      onClose={handleCloseTrigger}
      response={location.state}
    />
  );
};

export default Post;
