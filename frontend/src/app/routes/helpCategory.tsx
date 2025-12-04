import { useEffect, useState } from "react";
import { HelpCategoryCard } from "@/features/help/components/helpCategory/helpCategoryCard";
import styles from "@/features/help/styles/helpCategory.module.css";
import { Header } from "@/components/ui/header/header";
import type { HelpCategoryType } from "@/features/help/types/helpCategory";
import { getHelpCategory } from "@/features/help/api/getHelpCategory";

export const HelpCategory = () => {
  const [helpCategory, setHelpCategory] = useState<HelpCategoryType[]>([]);

  useEffect(() => {
    const fetchHelpCategory = async () => {
      try {
        const response = await getHelpCategory();
        setHelpCategory(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching helpCategory data:", error);
      }
    };

    fetchHelpCategory();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1>ヘルプ一覧</h1>

        <div className={styles.helpCategoryContainer}>
          {helpCategory.map((item) => (
            <HelpCategoryCard
              key={item.id}
              title={item.categoryName}
              description={item.description}
              iconUrl={item.iconUrl}
              to={``}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HelpCategory;
