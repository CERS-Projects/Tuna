import React from "react";
import { Header } from "@/components/ui/header/header";
import { HelpContentsItem } from "@/features/help/components/helpContentsItem/helpContentsItem";
import style from "@/styles/helpcontents.module.css";
import { GiControlTower } from "react-icons/gi";
type helpCategoryData = {
  categoryId: number;
  title: string;
};

const helpContents = () => {
  const categoryDummyData: helpCategoryData = {
    categoryId: 1,
    title: "テストタイトル",
  };
  const contentsDummyData = [
    {
      contentsId: 1,
      question: "How to create an account?",
      answer: "To create an account, click on the Sign Up button...",
    },
    {
      contentsId: 2,
      question: "How to reset my password?",
      answer: "To reset your password, go to the login page and click on...",
    },
  ];

  return (
    <div>
      <Header />
      <div className={style.helpContetntscontainer}>
        <div className={style.titleContainer}>
          <h1 className={style.categoryTitle}>{categoryDummyData.title}</h1>
          <GiControlTower className={style.categoryIcon} />
        </div>

        <div className={style.contentsList}>
          {contentsDummyData.map((content) => (
            <HelpContentsItem
              key={content.contentsId}
              question={content.question}
              answer={content.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default helpContents;
