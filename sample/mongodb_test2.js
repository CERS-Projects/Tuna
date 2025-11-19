// --- 1. データベースの指定と接続 ---
// ファイル実行時を想定して db オブジェクトを初期化
try { 
    db = db.getSiblingDB("tuna_mongodb"); 
} catch (e) { 
    print("Error: データベースの初期化に失敗しました。"); 
    quit(); 
}

// --- 2. クリーンアップ処理 (接続後に実行) ---
// テスト前に既存のデータを削除して環境をリセットします
try {
    db.post_collection.deleteMany({});
    db.profile_collection.deleteMany({});
    db.classroom_collection.deleteMany({});
    db.report_collection.deleteMany({});
    db.inqury_collection.deleteMany({});
    print("\n--- ターゲットコレクションをクリーンアップしました ---");
} catch (e) {
    print("Error: クリーンアップ中にエラーが発生しました: " + e.message);
}

// --- 3. 検証関数の定義 ---
function runTest(testName, codeFn, expectedToSucceed) {
    let collectionName = "Unknown";
    try {
        // 実行するコードからコレクション名を簡易的に抽出（ログ表示用）
        const codeString = codeFn.toString();
        const match = codeString.match(/db\.(\w+)\.insertOne/);
        if (match && match[1]) { collectionName = match[1]; }

        codeFn();
        
        if (expectedToSucceed) {
            print(`✅ PASS: ${testName} (${collectionName}) が期待通り成功しました。`);
        } else {
            print(`❌ FAIL: ${testName} (${collectionName}) が予期せず成功しました。`);
        }
    } catch (e) {
        if (!expectedToSucceed) {
            // 失敗が期待されている場合、エラー内容がバリデーション関連かチェック
            const isValidationError = e.message.includes("failed validation") || e.message.includes("Document failed validation");
            print(`✅ PASS: ${testName} (${collectionName}) が期待通り失敗しました。エラー: ${isValidationError ? "バリデーションエラー" : "その他のエラー(" + e.message + ")"}`);
        } else {
            print(`❌ FAIL: ${testName} (${collectionName}) が予期せず失敗しました。エラー: ${e.message.substring(0, 80)}...`);
        }
    }
}

print("\n--- 厳格な境界条件テスト開始 ---");

// ====================================================================
// A. post_collection (sentence: minLength: 3, maxLength: 255)
// ====================================================================
print("\n--- A. post_collection (投稿) ---");
runTest("A-1: 成功例 (最小長 3)", () => db.post_collection.insertOne({ user_id: 1, post_date: new Date(), sentence: "abc", good: 0, share_range: [1], post_flag: false }), true);
runTest("A-2: 失敗例 (最小長 2)", () => db.post_collection.insertOne({ user_id: 1, post_date: new Date(), sentence: "ab", good: 0, share_range: [1], post_flag: false }), false);
runTest("A-3: 成功例 (最大長 255)", () => db.post_collection.insertOne({ user_id: 1, post_date: new Date(), sentence: "a".repeat(255), good: 0, share_range: [1], post_flag: false }), true);
runTest("A-4: 失敗例 (最大長 256)", () => db.post_collection.insertOne({ user_id: 1, post_date: new Date(), sentence: "a".repeat(256), good: 0, share_range: [1], post_flag: false }), false);

// ====================================================================
// B. profile_collection (nickname/show_user_id: maxLength: 20)
// ====================================================================
print("\n--- B. profile_collection (プロフィール) ---");
runTest("B-1: 成功例 (nickname 最大長 20)", () => db.profile_collection.insertOne({ user_id: 10, nickname: "a".repeat(20), show_user_id: "test", follow: 0, follower: 0 }), true);
runTest("B-2: 失敗例 (show_user_id 最大長 21)", () => db.profile_collection.insertOne({ user_id: 11, nickname: "test", show_user_id: "a".repeat(21), follow: 0, follower: 0 }), false);
runTest("B-3: 成功例 (introduction 最大長 200)", () => db.profile_collection.insertOne({ user_id: 12, nickname: "test", show_user_id: "test", follow: 0, follower: 0, introduction: "b".repeat(200) }), true);

// ====================================================================
// C. classroom_collection (room_id: minimum: 1, room_name: maxLength: 50, categorys: minItems: 0)
// ====================================================================
print("\n--- C. classroom_collection (授業ルーム) ---");
runTest("C-1: 成功例 (room_id 最小値 1)", () => db.classroom_collection.insertOne({ room_id: 1, school_id: 1, teacher_id: 1, room_name: "数学", latest_update: new Date(), categorys: [] }), true);
runTest("C-2: 失敗例 (room_id 最小値 0)", () => db.classroom_collection.insertOne({ room_id: 0, school_id: 1, teacher_id: 1, room_name: "数学", latest_update: new Date(), categorys: [] }), false);
runTest("C-3: 成功例 (room_name 最大長 50)", () => db.classroom_collection.insertOne({ room_id: 2, school_id: 1, teacher_id: 1, room_name: "a".repeat(50), latest_update: new Date(), categorys: [] }), true);
runTest("C-4: 失敗例 (room_name 最大長 51)", () => db.classroom_collection.insertOne({ room_id: 3, school_id: 1, teacher_id: 1, room_name: "a".repeat(51), latest_update: new Date(), categorys: [] }), false);
runTest("C-5: 成功例 (categorys minItems 0 - 空配列)", () => db.classroom_collection.insertOne({ room_id: 4, school_id: 1, teacher_id: 1, room_name: "テスト", latest_update: new Date(), categorys: [] }), true);

// ====================================================================
// D. report_collection (detail: minLength: 1, maxLength: 300)
// ====================================================================
print("\n--- D. report_collection (通報) ---");
const baseReport = { report_id: 700, school_id: 1, report_date: new Date(), report_by: 10, reported_user: 20, reason_id: 1 };
runTest("D-1: 成功例 (detail 最小長 1)", () => db.report_collection.insertOne({ ...baseReport, report_id: 701, detail: "a" }), true);
runTest("D-2: 失敗例 (detail 最小長 0)", () => db.report_collection.insertOne({ ...baseReport, report_id: 702, detail: "" }), false);
runTest("D-3: 成功例 (detail 最大長 300)", () => db.report_collection.insertOne({ ...baseReport, report_id: 703, detail: "b".repeat(300) }), true);
runTest("D-4: 失敗例 (detail 最大長 301)", () => db.report_collection.insertOne({ ...baseReport, report_id: 704, detail: "b".repeat(301) }), false);

// ====================================================================
// E. inqury_collection (mailaddress: maxLength: 254)
// ====================================================================
print("\n--- E. inqury_collection (問い合わせ) ---");
const baseInquiry = { inqury_id: 900, datetime: new Date(), subject: "質問", content: "詳細" };
// 254文字の有効なメールアドレス（例：ローカル部244文字 + @ + ドメイン部9文字）
const longEmail = "a".repeat(244) + "@b.com"; 
runTest("E-1: 成功例 (mailaddress 最大長 254)", () => db.inqury_collection.insertOne({ ...baseInquiry, inqury_id: 901, mailaddress: longEmail }), true);
// 255文字のメールアドレス
const tooLongEmail = "a".repeat(249) + "@b.com"; 
runTest("E-2: 失敗例 (mailaddress 最大長 255)", () => db.inqury_collection.insertOne({ ...baseInquiry, inqury_id: 902, mailaddress: tooLongEmail }), false);