// データベースの指定（ファイル実行時を想定）
try { const db = db.getSiblingDB("tuna_mongodb"); } catch (e) { print("Error: データベースの初期化に失敗しました。"); quit(); }

// --- クリーンアップ ---
try{
    db.collection("post_collection").deleteMany({});
    db.collection("profile_collection").deleteMany({});
    db.collection("classroom_collection").deleteMany({});
    db.collection("report_collection").deleteMany({});
    db.collection("inqury_collection").deleteMany({});
print("\n--- ターゲットコレクションをクリーンアップしました ---");
}catch(Exception){
    print(`エラーが発生しました: ${Exception.message}`);
}

// --- 1. 検証関数の定義 ---
function runTest(testName, codeFn, expectedToSucceed) {
    let collectionName = "Unknown";
    try {
        // 実行されるコードからコレクション名を取得しようと試みる
        const codeString = codeFn.toString();
        const match = codeString.match(/db\.(\w+)\.insertOne/);
        if (match && match[1]) {
             collectionName = match[1];
        }

        codeFn();
        const result = "成功";
        if (expectedToSucceed) {
            print(`✅ PASS: ${testName} (${collectionName}) が期待通り成功しました。`);
        } else {
            print(`❌ FAIL: ${testName} (${collectionName}) が予期せず成功しました。`);
        }
    } catch (e) {
        const result = "失敗";
        if (!expectedToSucceed) {
            print(`✅ PASS: ${testName} (${collectionName}) が期待通り失敗しました。エラー: ${e.message.includes("failed validation") ? "バリデーションエラー" : "その他のエラー"}`);
        } else {
            print(`❌ FAIL: ${testName} (${collectionName}) が予期せず失敗しました。エラー: ${e.message.substring(0, 80)}...`);
        }
    }
}

// --- 2. 検証の実行 (ユニーク制約検証なし) ---
print("\n--- スキーマバリデーション検証開始 ---");

// ====================================================================
// A. post_collection (投稿) - スキーマ検証
// ====================================================================
runTest("A-1: 成功例 (スキーマ適合)", () => db.post_collection.insertOne({ user_id: 100, post_date: new Date(), sentence: "テスト投稿。", good: 5, share_range: [1], post_flag: false }), true);
runTest("A-2: 成功例 (同一ユーザーの2回目投稿)", () => db.post_collection.insertOne({ user_id: 100, post_date: new Date(), sentence: "2つ目の投稿。", good: 0, share_range: [1, 2], post_flag: false }), true);
runTest("A-3: 失敗例 (user_idがrequired)", () => db.post_collection.insertOne({ post_date: new Date(), sentence: "必須項目なし。", good: 0, share_range: [1], post_flag: false }), false);
runTest("A-4: 失敗例 (post_dateの型エラー)", () => db.post_collection.insertOne({ user_id: 100, post_date: "不正な日付", sentence: "型エラー。", good: 0, share_range: [1], post_flag: false }), false);

// ====================================================================
// B. profile_collection (プロフィール) - スキーマ検証
// ====================================================================
runTest("B-1: 成功例 (スキーマ適合)", () => db.profile_collection.insertOne({ user_id: 200, nickname: "太郎", show_user_id: "taro200", follow: 1, follower: 10 }), true);
runTest("B-2: 失敗例 (required項目不足)", () => db.profile_collection.insertOne({ user_id: 201, nickname: "次郎", show_user_id: "jiro201", follow: 0 }), false);
runTest("B-3: 失敗例 (followの型エラー)", () => db.profile_collection.insertOne({ user_id: 202, nickname: "花子", show_user_id: "hana202", follow: "one", follower: 0 }), false);

// ====================================================================
// C. follow_and_follower_collection (フォロー) - スキーマ検証
// ====================================================================
runTest("C-1: 成功例 (スキーマ適合)", () => db.follow_and_follower_collection.insertOne({ follower_id: 300, following_id: 301, created_at: new Date() }), true);
runTest("C-2: 失敗例 (required項目不足)", () => db.follow_and_follower_collection.insertOne({ follower_id: 302, following_id: 303 }), false); 

// ====================================================================
// D. bookmark_collection (ブックマーク) - スキーマ検証
// ====================================================================
runTest("D-1: 成功例 (スキーマ適合)", () => db.bookmark_collection.insertOne({ user_id: 400, bookmark: [] }), true);
runTest("D-2: 失敗例 (user_idの型エラー)", () => db.bookmark_collection.insertOne({ user_id: "401", bookmark: [] }), false);

// ====================================================================
// E. goods_collection (いいね) - スキーマ検証
// ====================================================================
runTest("E-1: 成功例 (スキーマ適合)", () => db.goods_collection.insertOne({ user_id: 500, goods: [] }), true);
runTest("E-2: 失敗例 (required項目不足)", () => db.goods_collection.insertOne({ goods: [] }), false); 

// ====================================================================
// F. classroom_collection (授業ルーム) - スキーマ検証
// ====================================================================
runTest("F-1: 成功例 (スキーマ適合)", () => db.classroom_collection.insertOne({ room_id: 600, school_id: 1, teacher_id: 1, room_name: "数学1", latest_update: new Date(), categorys: [] }), true);
runTest("F-2: 失敗例 (room_idのminimum制約)", () => db.classroom_collection.insertOne({ room_id: 0, school_id: 1, teacher_id: 1, room_name: "数学1", latest_update: new Date(), categorys: [] }), false);

// ====================================================================
// G. report_collection (通報) - スキーマ検証
// ====================================================================
runTest("G-1: 成功例 (スキーマ適合)", () => db.report_collection.insertOne({ report_id: 700, school_id: 1, report_date: new Date(), report_by: 10, reported_user: 20, reason_id: 1, detail: "不適切な投稿" }), true);
runTest("G-2: 失敗例 (detailのmaxLength制約)", () => db.report_collection.insertOne({ report_id: 701, school_id: 1, report_date: new Date(), report_by: 10, reported_user: 20, reason_id: 1, detail: "a".repeat(301) }), false);

// ====================================================================
// H. reason_collection (通報理由) - スキーマ検証
// ====================================================================
runTest("H-1: 成功例 (スキーマ適合)", () => db.reason_collection.insertOne({ reason_id: 1, reason: "迷惑行為" }), true);
runTest("H-2: 失敗例 (reason_idの型エラー)", () => db.reason_collection.insertOne({ reason_id: "one", reason: "迷惑行為" }), false);

// ====================================================================
// I. notion_collection (お知らせ) - スキーマ検証
// ====================================================================
runTest("I-1: 成功例 (スキーマ適合)", () => db.notion_collection.insertOne({ notice_id: 800, group_id: 1, title: "テスト通知", content: "内容", reservation_datetime: new Date() }), true);
runTest("I-2: 失敗例 (required項目不足)", () => db.notion_collection.insertOne({ notice_id: 801, group_id: 1, title: "テスト通知", content: "内容" }), false);

// ====================================================================
// J. inqury_collection (問い合わせ) - スキーマ検証
// ====================================================================
runTest("J-1: 成功例 (スキーマ適合)", () => db.inqury_collection.insertOne({ inqury_id: 900, datetime: new Date(), subject: "質問", content: "詳細", mailaddress: "test@example.com" }), true);
runTest("J-2: 失敗例 (mailaddressのmaxLength制約)", () => db.inqury_collection.insertOne({ inqury_id: 901, datetime: new Date(), subject: "質問", content: "詳細", mailaddress: "a".repeat(255) + "@b.com" }), false);