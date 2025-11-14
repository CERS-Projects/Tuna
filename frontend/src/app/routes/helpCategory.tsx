import { HelpCategoryCard } from "@/features/help/components/helpCategory/helpCategoryCard";
import Styles  from "@/features/help/styles/helpCategory.module.css"
import { Header } from "@/components/ui/header/header";

type HelpItem = {
  id: number;
  title: string;
  description: string;
  iconUrl?: string;
}

const HelpDataDummy: HelpItem[] = [
  { 
    id: 1,
    title: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    description: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    iconUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh992Feh17LdokXFmUpRtsZ_qW7TSbpui8Sz_Xh_RQpVQ98UpX304YmCm6YQF-d-eguV-I-2zdEel7gORrAEYWEEwxsv6vS_tn7hFwITDxNgzhf3c1p8biIIkClCw7ZyqBSEFMDL2smTSWJ/s180-c/figure_katagumi_friends.png",
  },
  {
    id: 2,
    title: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    description: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    iconUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh992Feh17LdokXFmUpRtsZ_qW7TSbpui8Sz_Xh_RQpVQ98UpX304YmCm6YQF-d-eguV-I-2zdEel7gORrAEYWEEwxsv6vS_tn7hFwITDxNgzhf3c1p8biIIkClCw7ZyqBSEFMDL2smTSWJ/s180-c/figure_katagumi_friends.png",
  },
  {
    id: 3,
    title: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    description: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    iconUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh992Feh17LdokXFmUpRtsZ_qW7TSbpui8Sz_Xh_RQpVQ98UpX304YmCm6YQF-d-eguV-I-2zdEel7gORrAEYWEEwxsv6vS_tn7hFwITDxNgzhf3c1p8biIIkClCw7ZyqBSEFMDL2smTSWJ/s180-c/figure_katagumi_friends.png",
  },
  {
    id: 4,
    title: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    description: "あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお",
    iconUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh992Feh17LdokXFmUpRtsZ_qW7TSbpui8Sz_Xh_RQpVQ98UpX304YmCm6YQF-d-eguV-I-2zdEel7gORrAEYWEEwxsv6vS_tn7hFwITDxNgzhf3c1p8biIIkClCw7ZyqBSEFMDL2smTSWJ/s180-c/figure_katagumi_friends.png",
  },
]

export const HelpCategory = () => {
  return (
    <>
      <Header />
      <div className = {Styles.wrapper}>
        <h1>ヘルプ一覧</h1>
        
        <div className = {Styles.helpCategoryContainer}>
          {HelpDataDummy.map ((item) => (
            <HelpCategoryCard
              key = {item.id}
              title = {item.title}
              description = {item.description}
              iconUrl = {item.iconUrl}
              to = {``}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HelpCategory;
