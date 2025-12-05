import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import {
  BsBookmark,
  BsBookmarkFill,
  BsChat,
  BsExclamationCircle,
} from "react-icons/bs";
import { useNavigate, Link } from "react-router";
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

export const PostBox = ({
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
          {iconUrl && <img src={iconUrl} className={styles.userIcon} alt="" />}
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
                alt=""
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
        containerStyle={{ maxHeight: "500px", maxWidth: "500px" }}
      >
        <img
          className={styles.modalImg}
          src={selectedImg}
          alt="Enlarged post image"
        />
      </Modal>
    </>
  );
};
