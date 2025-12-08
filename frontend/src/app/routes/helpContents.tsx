import { useLocation, useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/header/header";
import { GiControlTower } from "react-icons/gi";
import { HelpContentsItem } from "@/features/help/components/helpContentsItem/helpContentsItem";
import { getHelpContents } from "@/features/help/api/getHelpContents";
import { getHelpCategory } from "@/features/help/api/getHelpCategory";
import { type HelpContentsType } from "@/features/help/types/helpContents";
import style from "@/features/help/styles/helpContents.module.css";

const HelpContents = () => {
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { title?: string };
  const categoryId = params.id ? Number(params.id) : undefined;
  const navigate = useNavigate();

  const [contents, setContents] = useState<HelpContentsType[]>([]);
  const [categoryName, setCategoryName] = useState<string>(state?.title ?? "");

  useEffect(() => {
    const fetchHelpContents = async () => {
      try {
        if (!categoryId || isNaN(Number(categoryId))) {
          navigate("/not-found", { replace: true });
          return;
        }

        if (!categoryName) {
          const categories = await getHelpCategory();
          const targetCategory = categories.find(
            (c) => c.categoryId === categoryId
          );
          if (targetCategory) {
            setCategoryName(targetCategory.categoryName);
          } else {
            throw new Error("categoryName is None");
          }
        }

        const response = await getHelpContents(categoryId);
        setContents(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHelpContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, navigate]);

  return (
    <div>
      <Header />
      <div className={style.helpContentsContainer}>
        <div className={style.titleContainer}>
          <h1 className={style.categoryTitle}>{categoryName}</h1>
          <GiControlTower className={style.categoryIcon} />
        </div>

        <div className={style.contentsList}>
          {contents.map((item, index) => (
            <HelpContentsItem
              key={item.contentsId ?? index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default HelpContents;
