import PostBox from "@/components/ui/postBox/postBox";

type PostData = {
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

const dummyPostData: PostData[] = [
  {
    postId: 101,
    userId: "user_alice_42",
    userName: "Alice_Springs",
    iconUrl: "https://example.com/icons/alice_42.png", // オプショナルなプロパティ
    mainPost:
      "今日はとても天気が良くて気持ちいいですね！午後から公園に散歩に行こうかなと思っています。皆さんは週末どう過ごしますか？😊",
    goodCount: 154,
    commentCount: 28,
    goodCheck: true, // ログインユーザーが「いいね」済み
    bookmarkCheck: true, // ログインユーザーがブックマーク未登録
    postTo: "public", // 投稿先 (例: 全体公開)
    userTo: "none", // 返信先ユーザーID (今回は新規投稿のため 'none')
    postImgs: [
      "https://t3.ftcdn.net/jpg/00/88/24/46/240_F_88244619_mkXGnRIIP29QMrTfBn9qrIKWu4tYdgIG.jpg",
      "https://t3.ftcdn.net/jpg/00/88/24/46/240_F_88244619_mkXGnRIIP29QMrTfBn9qrIKWu4tYdgIG.jpg",
    ],
  },
  {
    postId: 101,
    userId: "user_alice_42",
    userName: "Alice_Springs",
    iconUrl: "https://example.com/icons/alice_42.png", // オプショナルなプロパティ
    mainPost:
      "今日はとても天気が良くて気持ちいいですね！午後から公園に散歩に行こうかなと思っています。皆さんは週末どう過ごしますか？😊",
    goodCount: 154,
    commentCount: 28,
    goodCheck: true, // ログインユーザーが「いいね」済み
    bookmarkCheck: false, // ログインユーザーがブックマーク未登録
    postTo: "public", // 投稿先 (例: 全体公開)
    userTo: "none", // 返信先ユーザーID (今回は新規投稿のため 'none')
    postImgs: [
      "https://pbs.twimg.com/media/G6HadySbAAEZDM4?format=jpg&name=small",
    ],
  },
  {
    postId: 101,
    userId: "user_alice_42",
    userName: "Alice_Springs",
    iconUrl: "https://example.com/icons/alice_42.png", // オプショナルなプロパティ
    mainPost:
      "今日はとても天気が良くて気持ちいいですね！午後から公園に散歩に行こうかなと思っています。皆さんは週末どう過ごしますか？😊",
    goodCount: 154,
    commentCount: 28,
    goodCheck: true, // ログインユーザーが「いいね」済み
    bookmarkCheck: false, // ログインユーザーがブックマーク未登録
    postTo: "public", // 投稿先 (例: 全体公開)
    userTo: "none", // 返信先ユーザーID (今回は新規投稿のため 'none')
    postImgs: [
      "https://t4.ftcdn.net/jpg/15/77/67/13/240_F_1577671387_xziXusa4v8cwaJpSkjvOO9LTDUljyeJp.jpg",
      "https://t4.ftcdn.net/jpg/15/77/67/13/240_F_1577671387_xziXusa4v8cwaJpSkjvOO9LTDUljyeJp.jpg",
      "https://t4.ftcdn.net/jpg/15/77/67/13/240_F_1577671387_xziXusa4v8cwaJpSkjvOO9LTDUljyeJp.jpg",
    ],
  },
  {
    postId: 101,
    userId: "user_alice_42",
    userName: "Alice_Springs",
    iconUrl: "https://example.com/icons/alice_42.png", // オプショナルなプロパティ
    mainPost:
      "今日はとても天気が良くて気持ちいいですね！午後から公園に散歩に行こうかなと思っています。皆さんは週末どう過ごしますか？😊",
    goodCount: 154,
    commentCount: 28,
    goodCheck: true, // ログインユーザーが「いいね」済み
    bookmarkCheck: false, // ログインユーザーがブックマーク未登録
    postTo: "public", // 投稿先 (例: 全体公開)
    userTo: "none", // 返信先ユーザーID (今回は新規投稿のため 'none')
    postImgs: ["https://kiso-hinoki.jp/koma1.jpg"],
  },
  {
    postId: 101,
    userId: "user_alice_42",
    userName: "Alice_Springs",
    iconUrl: "https://example.com/icons/alice_42.png", // オプショナルなプロパティ
    mainPost:
      "今日はとても天気が良くて気持ちいいですね！午後から公園に散歩に行こうかなと思っています。皆さんは週末どう過ごしますか？😊",
    goodCount: 154,
    commentCount: 28,
    goodCheck: true, // ログインユーザーが「いいね」済み
    bookmarkCheck: false, // ログインユーザーがブックマーク未登録
    postTo: "public", // 投稿先 (例: 全体公開)
    userTo: "none", // 返信先ユーザーID (今回は新規投稿のため 'none')
    postImgs: ["https://kiso-hinoki.jp/r05.jpg"],
  },
];

const Test = () => {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      {dummyPostData.map((item) => (
        <PostBox
          postId={item.postId}
          userId={item.userId}
          userName={item.userName}
          iconUrl={item.iconUrl}
          mainPost={item.mainPost}
          goodCount={item.goodCount}
          commentCount={item.commentCount}
          goodCheck={item.goodCheck}
          bookmarkCheck={item.bookmarkCheck}
          postTo={item.postTo}
          userTo={item.userTo}
          postImgs={item.postImgs}
        />
      ))}
    </div>
  );
};

export default Test;
