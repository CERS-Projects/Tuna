import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {
  BsBookmark,
  BsBookmarkFill,
  BsChat,
  BsExclamationCircle,
} from "react-icons/bs";
import { useNavigate, Link, useSearchParams } from "react-router";
import type React from "react";
import { useState, useRef } from "react";
import styles from "./postBox.module.css";
import { Modal, type ModalHandle } from "../modal/modal";
import { type PostData } from "@/features/post/types/post";
import { paths } from "@/config/paths";
import { useDebouncedLike } from "@/features/post/hooks/useGood";
import { useDebouncedBookmark } from "@/features/post/hooks/useBookmark";

export const PostBox = (props: PostData) => {
  const [searchParams] = useSearchParams();
  const currentGroupId = searchParams.get("groupId")
    ? Number(searchParams.get("groupId"))
    : undefined;

  const {
    postId,
    showUserId,
    nickname,
    icon,
    sentence,
    shareRange,
    likeCount,
    responseCount,
    isLiked,
    isBookmarked,
    imageUrl,
    isLink = true,
  } = props;

  const nameData = `${nickname}@${showUserId}`;
  const navigate = useNavigate();

  const [goodOn, setGoodOn] = useState(isLiked);
  const [tempLikeCount, setTempLikeCount] = useState<number>(likeCount);

  const [bookmarkOn, setBookmarkOn] = useState(isBookmarked);
  const [selectedImg, setSelectedImg] = useState<string>("");

  const { debouncedToggle: debouncedLikeToggle } = useDebouncedLike(
    postId,
    shareRange,
  );

  const { debouncedToggle: debouncedBookmarkToggle } = useDebouncedBookmark(
    postId,
    shareRange,
  );

  const modalRef = useRef<ModalHandle>(null);

  const handleNavigateClick = (
    e: React.MouseEvent,
    to: string,
    withState: boolean = false,
  ) => {
    e.preventDefault();

    if (withState)
      navigate(to, {
        state: {
          ...props,
          from: `${location.pathname}${location.search}${location.hash}`,
        },
      });
    else navigate(to);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    const newGood = !goodOn;
    setGoodOn(newGood);
    setTempLikeCount((prev) => (newGood ? prev + 1 : prev - 1));

    debouncedLikeToggle(newGood);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();

    const newBookmark = !bookmarkOn;
    setBookmarkOn(newBookmark);

    debouncedBookmarkToggle(newBookmark);
  };

  const handleImgClick = (e: React.MouseEvent, imgurl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImg(imgurl);
    if (modalRef.current) modalRef.current.show();
  };

  const renderContent = () => (
    <>
      <div
        className={styles.postHeader}
        onClick={(e) => handleNavigateClick(e, `/@${showUserId}`)}
      >
        {icon && <img src={icon} className={styles.userIcon} alt="" />}
        <span className={styles.userName}>{nameData}</span>
      </div>

      <p className={styles.postBody}>{sentence}</p>

      <div className={styles.postImgBox} data-count={imageUrl?.length}>
        {imageUrl?.map((imgurl, index) => (
          <img
            className={styles.postImg}
            key={index}
            src={imgurl || "default-image.jpg"}
            onClick={(e) => handleImgClick(e, imgurl)}
            alt=""
          />
        ))}
      </div>

      <div className={styles.postFooter}>
        <button onClick={handleLike}>
          {goodOn ? <FaThumbsUp /> : <FaRegThumbsUp />}
        </button>
        <span className={styles.goodCount}>{tempLikeCount}</span>
        <button
          onClick={(e) =>
            handleNavigateClick(e, paths.app.timeline.post.path, true)
          }
        >
          <BsChat />
        </button>
        <span className={styles.commentCount}>{responseCount}</span>
        <button onClick={handleBookmark}>
          {bookmarkOn ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
        <button onClick={(e) => handleNavigateClick(e, "")}>
          <BsExclamationCircle />
        </button>
      </div>
    </>
  );

  const containerClass = `${styles.postBoxLink} ${styles.postContainer}`;

  return (
    <>
      {isLink ? (
        <Link
          to={paths.app.timeline.detail.getHref(postId, currentGroupId)}
          state={{ item: props }}
          relative="path"
          className={containerClass}
        >
          {renderContent()}
        </Link>
      ) : (
        <div className={containerClass}>{renderContent()}</div>
      )}

      <Modal
        ref={modalRef}
        height="fit-content"
        width="fit-content"
        containerStyle={{ maxHeight: "500px", maxWidth: "500px" }}
      >
        {selectedImg && (
          <img className={styles.modalImg} src={selectedImg} alt="Enlarged" />
        )}
      </Modal>
    </>
  );
};
