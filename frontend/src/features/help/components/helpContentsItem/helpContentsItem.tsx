import { useState } from "react";
import type { MouseEvent } from "react";

import style from "./helpContentsItem.module.css";

type ContentsItemProps = {
  question: string;
  answer: string;
};

export const HelpContentsItem = (contents: ContentsItemProps) => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  // 💡 カード全体をクリックしたときのハンドラ
  const handleCardToggle = () => {
    setIsCardOpen(!isCardOpen);
  };

  // アコーディオンが閉じないようにするハンドラ
  const handleAnswerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={style.contentsCard} onClick={handleCardToggle}>
      <div className={style.questionSummary}>
        <span>Q</span>
        <div>{contents.question}</div>
        <span className={`${style.toggleIcon} ${isCardOpen ? style.open : ""}`}>
          ▶
        </span>
      </div>

      <div
        className={`${style.answerContainer} ${isCardOpen ? style.open : ""}`}
        onClick={handleAnswerClick}
      >
        <div className={style.answerContents}>
          <span>A.</span>
          {contents.answer}
        </div>
      </div>
    </div>
  );
};
