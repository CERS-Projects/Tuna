import { PostCreateModal } from "@/features/post/components/postCreate/postCreate";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { type ModalHandle } from "@/components/ui/modal/modal";
import { paths } from "@/config/paths";

const Post = () => {
  const navigate = useNavigate();
  const modalRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.show();
    }
  }, []);

  const handleCloseTrigger = () => {
    navigate(paths.app.timeline.path);
  };

  return <PostCreateModal ref={modalRef} onClose={handleCloseTrigger} />;
};

export default Post;
