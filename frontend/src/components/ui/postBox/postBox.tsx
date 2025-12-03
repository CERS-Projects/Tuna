import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {
  BsBookmark,
  BsBookmarkFill,
  BsChat,
  BsExclamationCircle,
} from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import type React from "react";
import { useState, useRef } from "react";
import styles from "./postBox.module.css";
import { Modal, type ModalHandle } from "../modal/modal";

type PostDataProps = {
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
};

const PostBox = ({
  postId,
  userId,
  userName,
  iconUrl,
  mainPost,
  goodCount,
  commentCount,
  goodCheck,
  bookmarkCheck,
  postTo,
  userTo,
  postImgs,
}: PostDataProps) => {
  const nameData = `${userName}@${userId}`;
  const navigate = useNavigate();

  const [goodOn, setGoodOn] = useState(goodCheck);
  const [bookmarkOn, setBookmarkOn] = useState(bookmarkCheck);
  const [selectedImg, setSelectedImg] = useState<string>("");

  const modalRef = useRef<ModalHandle>(null);

  const handleNavigateClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    navigate(to);
  };
  const goodClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setGoodOn((prev) => !prev);
  };
  const bookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookmarkOn((prev) => !prev);
  };

  const handleImgClick = (e: React.MouseEvent, imgurl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImg(imgurl);

    if (modalRef.current) {
      modalRef.current.show();
    }
  };

  return (
    <>
      <Link
        to={postTo}
        className={`${styles.postBoxLink} ${styles.postContainer}`}
      >
        <div
          className={styles.postHeader}
          onClick={(e) => handleNavigateClick(e, userTo)}
        >
          {iconUrl && (
            <img
              src={
                "data:image/jpeg;base64,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"
              }
              className={styles.userIcon}
            />
          )}
          <span className={styles.userName}>{nameData}</span>
        </div>

        <p className={styles.postBody}>{mainPost}</p>
        <div className={styles.postImgBox} data-count={postImgs?.length}>
          {postImgs &&
            postImgs.map((imgurl, index) => (
              <img
                className={styles.postImg}
                key={index}
                src={imgurl}
                onClick={(e) => handleImgClick(e, imgurl)}
              />
            ))}
        </div>

        <div className={styles.postFooter}>
          <button onClick={goodClick}>
            {goodOn ? <FaThumbsUp /> : <FaRegThumbsUp />}
          </button>
          <span className={styles.goodCount}>{goodCount}</span>
          <button onClick={(e) => handleNavigateClick(e, "/login")}>
            <BsChat />
          </button>
          <span className={styles.commentCount}>{commentCount}</span>
          <button onClick={bookmarkClick}>
            {bookmarkOn ? <BsBookmarkFill /> : <BsBookmark />}
          </button>
          <button onClick={(e) => handleNavigateClick(e, "")}>
            <BsExclamationCircle />
          </button>
        </div>
      </Link>

      <Modal
        ref={modalRef}
        height={"fit-content"}
        width={"fit-content"}
        containerStyle={{ maxHeight: "5000", maxWidth: "5000" }}
      >
        <img className={styles.modalImg} src={selectedImg} />
      </Modal>
    </>
  );
};

export default PostBox;
