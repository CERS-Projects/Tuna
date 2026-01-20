import { SearchBar } from "@/components/ui/search/search";
import { useState } from "react";
import { TiRefresh } from "react-icons/ti";
import { PostBox } from "@/components/ui/postBox/postBox";
import styles from "./searchHistory.module.css";

const dummyHistory = ["e", "d", "c", "b", "a"];

type PostDataItem = {
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

const PostDummy: PostDataItem[] = [
  {
    postId: 1,
    userId: "u001",
    userName: "田中 太郎",
    iconUrl: "https://placehold.co/100x100/orange/white?text=T",
    mainPost:
      "今日のランチは駅前の新しいカフェに行きました！パスタが絶品でした🍝 #ランチ #カフェ",
    goodCount: 120,
    commentCount: 5,
    goodCheck: true,
    bookmarkCheck: false,
    postTo: "2024/12/08 12:30",
    userTo: "@tanaka_taro",
    postImgs: [
      "https://placehold.co/600x400/skyblue/white?text=Pasta+Image",
      "https://placehold.co/600x400/pink/white?text=Cafe+Interior",
    ],
  },
  {
    postId: 2,
    userId: "u002",
    userName: "エンジニア見習い",
    iconUrl: "https://placehold.co/100x100/333/white?text=Dev",
    mainPost:
      "Reactのレンダリングの仕組みがいまいち掴めない...。誰か詳しい人教えてください！🤔",
    goodCount: 8,
    commentCount: 12,
    goodCheck: false,
    bookmarkCheck: true,
    postTo: "2024/12/08 10:15",
    userTo: "@dev_beginner",
    // 画像なしパターン
  },
  {
    postId: 3,
    userId: "u003",
    userName: "Traveler J",
    // iconUrlなしパターン（デフォルトアイコン表示のテスト用）
    mainPost:
      "やっと週末！今から温泉旅行に行ってきます♨️ 雪景色が見られるといいな。",
    goodCount: 342,
    commentCount: 0,
    goodCheck: true,
    bookmarkCheck: true,
    postTo: "2024/12/07 18:00",
    userTo: "@travel_lover",
    postImgs: ["https://placehold.co/600x400/teal/white?text=Train+View"],
  },
];

export const SearchHistory = () => {
  const [query, setQuery] = useState<string>("");
  const [history, setHistory] = useState<string[]>(dummyHistory);
  const [searchData, setSearchData] = useState<typeof PostDummy | null>(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const newHistory = [query, ...history].slice(0, 5);
    setHistory(newHistory);
    setSearchData(PostDummy);
    setIsFocused(false);
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
    setIsFocused(false);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
            }, 200);
          }}
        />

        {isFocused && history.length > 0 && (
          <ul className={styles.searchHistoryList}>
            {history.map((item, index) => (
              <li
                key={index}
                onClick={() => handleHistoryClick(item)}
                className={styles.searchHistoryItem}
              >
                <TiRefresh className={styles.searchHistoryIcon} />
                <span className={styles.searchHistoryText}>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {searchData && (
        <div>
          {searchData.map((item) => (
            <PostBox key={item.postId} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};
