import { SearchBar } from "@/components/ui/search/search";
import { useState } from "react";
import { TiRefresh } from "react-icons/ti";
import { PostBox } from "@/components/ui/postBox/postBox";
import styles from "./searchHistory.module.css";
import { type PostData } from "@/features/post/types/post";

const dummyHistory = ["e", "d", "c", "b", "a"];

const PostDummy: PostData[] = [
  {
    postId: "1",
    userId: 1,
    postDate: "2024-12-08T12:30:00",
    sentence:
      "今日のランチは駅前の新しいカフェに行きました！パスタが絶品でした🍝 #ランチ #カフェ",
    likeCount: 120,
    responseCount: 5,
    shareRange: [1, 2],
    nickname: "田中 太郎",
    showUserId: "u001",
    icon: "https://placehold.co/100x100/orange/white?text=T",
    isLiked: true,
    isBookmarked: false,
    imageUrl: [
      "https://placehold.co/600x400/skyblue/white?text=Pasta+Image",
      "https://placehold.co/600x400/pink/white?text=Cafe+Interior",
    ],
  },
  {
    postId: "2",
    userId: 2,
    postDate: "2024-12-08T10:15:00",
    sentence:
      "Reactのレンダリングの仕組みがいまいち掴めない...。誰か詳しい人教えてください！🤔",
    likeCount: 8,
    responseCount: 12,
    shareRange: [1],
    nickname: "エンジニア見習い",
    showUserId: "u002",
    icon: "https://placehold.co/100x100/333/white?text=Dev",
    isLiked: false,
    isBookmarked: true,
    // 画像なしパターン
  },
  {
    postId: "3",
    userId: 3,
    postDate: "2024-12-07T18:00:00",
    sentence:
      "やっと週末！今から温泉旅行に行ってきます♨️ 雪景色が見られるといいな。",
    likeCount: 342,
    responseCount: 0,
    shareRange: [1, 2, 3],
    nickname: "Traveler J",
    showUserId: "u003",
    icon: "https://placehold.co/100x100/gray/white?text=T",
    isLiked: true,
    isBookmarked: true,
    imageUrl: ["https://placehold.co/600x400/teal/white?text=Train+View"],
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
