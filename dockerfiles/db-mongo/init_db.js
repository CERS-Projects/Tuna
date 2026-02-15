try {
  db = db.getSiblingDB("tuna_mongodb"); //mysqlで言うuse　○○
} catch (Exception) {
  print(`エラーが発生しました: ${Exception.message}`);
}
try {
  db.createCollection("post_collection", {
    validator: {
      $jsonSchema: {
        /* Key-Valueを持つドキュメントやJSONのような構造 */
        bsonType: "object",
        /* requiredはNOT NULL制約みたいなもの */
        required: [
          "user_id",
          "post_date",
          "sentence",
          "like_count",
          "share_range",
          "post_flag",
        ],
        properties: {
          user_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意のuser_idを格納する",
          },
          post_date: {
            bsonType: "date",
            description:
              "投稿時間を記録するためのもの。書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
          sentence: {
            bsonType: "string",
            minLength: 1,
            maxLength: 255,
            description: "投稿の本文",
          },
          image_objectKey: {
            bsonType: "array",
            description: "投稿に添付する画像がある場合記録",
          },
          like_count: {
            bsonType: "int",
            minimum: 0,
            description: "投稿についているいいねの総数",
          },
          response_count: {
            bsonType: "int",
            minimum: 0,
            description: "投稿に対する返信の総数",
          },
          share_range: {
            bsonType: "array",
            description: "共有したいグループの配列",
            items: {
              bsonType: "int",
              description: "share_rangeに入る要素",
            },
          },
          response_to: {
            bsonType: ["objectId", "null"],
            description: "返信先のBSONのオブジェクトID",
          },
          post_flag: {
            bsonType: "bool",
            description: "投稿の有効状態の管理 true=有効, false=論理削除済",
          },
        },
      },
    },
  });

  db.createCollection("profile_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "nickname", "show_user_id", "follow", "follower"],
        properties: {
          user_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意のuser_idを格納する",
          },
          nickname: {
            bsonType: "string",
            minLength: 1,
            maxLength: 20,
            description: "ユーザの名前を定義する 重複可",
          },
          icon: {
            bsonType: "string",
            description:
              "ユーザアイコンの保存場所のPath アイコンはクラウド上に保存する",
          },
          show_user_id: {
            bsonType: "string",
            minLength: 1,
            maxLength: 20,
            description: "表示用ユーザIDの格納",
          },
          introduction: {
            bsonType: "string",
            minLength: 1,
            maxLength: 200,
            description: "プロフィールに掲載する自己紹介文",
          },
          follow: {
            bsonType: "int",
            minimum: 0,
            description: "ユーザがフォローしている人数を格納",
          },
          follower: {
            bsonType: "int",
            minimum: 0,
            description: "ほかのユーザからフォローされている人数を格納",
          },
          filtering: {
            bsonType: "array",
            items: {
              bsonType: "string",
            },
            description: "ミュートワード",
          },
        },
      },
    },
  });

  db.createCollection("search_history_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "search_history"],
        properties: {
          user_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意のuser_idを格納",
          },
          search_history: {
            bsonType: "array",
            items: {
              bsonType: "object",
              required: ["query", "searched_at"],
              properties: {
                query: {
                  bsonType: "string",
                  minLength: 1,
                  maxLength: 20,
                  description: "検索クエリを格納",
                },
                searched_at: {
                  bsonType: "date",
                  description: "検索日を格納 書式はyyyy-mm-dd-hh-mm-ss-ms",
                },
              },
            },
            description: "検索履歴を補完するためのデータ構造",
          },
        },
      },
    },
  });

  db.createCollection("bookmark_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "post_id", "bookmarked_at"],
        properties: {
          user_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLに格納されている一意のユーザIDを格納",
          },
          post_id: {
            bsonType: "objectId",
            description: "ブックマークした投稿のオブジェクトIDを格納",
          },
          bookmarked_at: {
            bsonType: "date",
            description: "リレーションが生成された日時",
          },
        },
      },
    },
  });

  db.createCollection("follow_and_follower_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["follower_id", "following_id", "created_at"],
        properties: {
          follower_id: {
            bsonType: "int",
            description:
              "フォローしているユーザーのMySQLに定義されている一意のuser_id",
          },
          following_id: {
            bsonType: "int",
            description:
              "フォローされているユーザーのMySQLにて議されている一意のuser_id",
          },
          created_at: {
            bsonType: "date",
            description: "リレーションシップが作成されたタイムスタンプ",
          },
        },
      },
    },
  });

  db.createCollection("like_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "post_id", "liked_at"],
        properties: {
          user_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意のuser_idを格納",
          },
          post_id: {
            bsonType: "objectId",
            description: "投稿のオブジェクトIDを格納",
          },
          liked_at: {
            bsonType: "date",
            description: "リレーションが生成された日時",
          },
        },
      },
    },
  });

  db.createCollection("classroom_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "school_id",
          "teacher_id",
          "room_name",
          "description",
          "latest_update",
        ],
        properties: {
          school_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意の学校IDを格納する",
          },
          teacher_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLで定義されている一意の教師IDを格納する",
          },
          room_name: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50,
            description: "教室名を格納する",
          },
          description: {
            bsonType: "string",
            minLength: 1,
            maxLength: 200,
            description: "教室の説明を格納する",
          },
          latest_update: {
            bsonType: "date",
            description:
              "最新の更新日時を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
        },
      },
    },
  });
  db.createCollection("classroom_category_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["classroom_id", "categoryname", "created_date"],
        properties: {
          classroom_id: {
            bsonType: "objectId",
            description: "classroom_collectionのオブジェクトIDを格納する",
          },
          categoryname: {
            bsonType: "string",
            minLength: 1,
            maxLength: 30,
            description: "カテゴリー名を格納する",
          },
          created_date: {
            bsonType: "date",
            description: "作成日時を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
        },
      },
    },
  });
  db.createCollection("classroom_document_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "classroom_category_id",
          "document_name",
          "document_objectKey",
          "upload_date",
        ],
        properties: {
          classroom_category_id: {
            bsonType: "objectId",
            description:
              "classroom_category_collectionのオブジェクトIDを格納する",
          },
          document_name: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50,
            description: "ドキュメント名を格納する",
          },
          document_objectKey: {
            bsonType: "string",
            description: "ドキュメントの保存場所のPathを格納する",
          },
          upload_date: {
            bsonType: "date",
            description:
              "ドキュメントのアップロード日時を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
        },
      },
    },
  });

  db.createCollection("report_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "school_id",
          "report_date",
          "report_by",
          "reported_user",
          "reason_id",
          "reported_post_id",
          "detail",
        ],
        properties: {
          school_id: {
            bsonType: "int",
            minimum: 1,
            description: "一意の学校識別子を格納する",
          },
          report_date: {
            bsonType: "date",
            description: "通報した日時を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
          report_by: {
            bsonType: "int",
            minimum: 1,
            description: "通報したユーザIDを格納する",
          },
          reported_user: {
            bsonType: "int",
            minimum: 1,
            description: "通報されたユーザIDを格納する",
          },
          reason_id: {
            bsonType: "int",
            description: "ラジオボタンで選択された内容を格納",
          },
          reported_post_id: {
            bsonType: "objectId",
            description: "通報された投稿のオブジェクトIDを格納する",
          },
          detail: {
            bsonType: "string",
            minLength: 1,
            maxLength: 300,
            description: "通報の詳細を格納する",
          },
        },
      },
    },
  });

  db.createCollection("reason_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["reason_id", "reason"],
        properties: {
          reason_id: {
            bsonType: "int",
            minimum: 1,
            description: "一意の通報理由IDを格納",
          },
          reason: {
            bsonType: "string",
            description: "通報理由カテゴリを格納",
          },
        },
      },
    },
  });

  db.createCollection("notice_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["group_id", "title", "content", "created_at"],
        properties: {
          group_id: {
            bsonType: "int",
            minimum: 1,
            description: "MySQLから一意のグループIDを格納する",
          },
          title: {
            bsonType: "string",
            minLength: 1,
            maxLength: 50,
            description: "お知らせのタイトルを格納する",
          },
          content: {
            bsonType: "string",
            minLength: 1,
            maxLength: 200,
            description: "お知らせの内容を格納する",
          },
          created_at: {
            bsonType: "date",
            description: "作成日時を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
        },
      },
    },
  });

  db.createCollection("inquiry_collection", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "datetime",
          "subject",
          "content",
          "mailaddress",
          "inquiry_status",
        ],
        properties: {
          datetime: {
            bsonType: "date",
            description: "問い合わせ日を格納 書式はyyyy-mm-dd-hh-mm-ss-ms",
          },
          subject: {
            bsonType: "string",
            minLength: 1,
            maxLength: 100,
            description: "問い合わせの件名を格納する",
          },
          content: {
            bsonType: "string",
            minLength: 1,
            maxLength: 300,
            description: "問い合わせの内容を格納する",
          },
          /* 個人情報の観点からこれって保存していいのか確認 */
          mailaddress: {
            bsonType: "string",
            minLength: 1,
            maxLength: 254,
            description: "問い合わせをしたユーザのメールアドレスを格納する",
          },
          inquiry_status: {
            bsonType: "int",
            enum: [0, 1, 2],
            description: "問い合わせの対応状態を格納する 0:受付待ち",
          },
        },
      },
    },
  });
} catch (Exception) {
  print(`エラーが発生しました: ${Exception.message}`);
}

// --- 3. ダミーデータの挿入 ---
print("\n--- ダミーデータの挿入開始 ---");

try {
  // A. post_collection
  db.post_collection.insertMany([
    {
      _id: ObjectId("669a84a2c914e6b7f329d201"), // 固定のObjectIdを指定
      user_id: 1,
      post_date: new Date(Date.now()),
      sentence: "最初のテスト投稿です。",
      image_objectKey: ["images/df7810bd-a128-487c-a389-8d836e35da22.jpg"],
      like_count: 5,
      response_count: 2,
      share_range: [0, 1],
      response_to: null,
      post_flag: true,
    },
    {
      _id: ObjectId("669a84a2c914e6b7f329d202"), // 固定のObjectIdを指定
      user_id: 1,
      post_date: new Date(Date.now() - 7200000), // 2時間前
      sentence: "返信テスト投稿です。",
      like_count: 3,
      response_count: 0,
      share_range: [0, 1, 5, 6],
      response_to: ObjectId("669a84a2c914e6b7f329d201"),
      post_flag: true,
    },
    {
      user_id: 2,
      post_date: new Date(Date.now() - 1800000), // 30分前
      sentence: "こんにちは！これはテスト投稿です。",
      image_objectKey: [
        "images/5c2808e4-2b7b-457d-ae43-9f8e3f9dd1fb.png",
        "images/63b81b67-68ec-4171-a28c-3042a33b8591.png",
      ],
      like_count: 7,
      response_count: 0,
      share_range: [0, 1, 2, 4, 5, 6],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 2,
      post_date: new Date(Date.now() - 2700000), // 45分前
      sentence: "はなこさんのグループでの投稿です！",
      like_count: 15,
      response_count: 0,
      share_range: [2],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 2,
      post_date: new Date(Date.now() - 3600000), // 1時間前
      sentence: "2番目の投稿。画像はありません。",
      like_count: 10,
      response_count: 0,
      share_range: [2, 5, 6],
      response_to: ObjectId("669a84a2c914e6b7f329d201"),
      post_flag: true,
    },
    {
      user_id: 3,
      post_date: new Date(Date.now() - 5400000), // 1.5時間前
      sentence: "テスト投稿3番目です！",
      like_count: 2,
      response_count: 0,
      share_range: [1, 3],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 4,
      post_date: new Date(Date.now() - 900000), // 15分前
      sentence: "最後のテスト投稿です。",
      like_count: 0,
      response_count: 0,
      share_range: [0, 5],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 4,
      post_date: new Date(Date.now() - 600000), // 10分前
      sentence: "情報処理学科の投稿です。",
      like_count: 0,
      response_count: 0,
      share_range: [5],
      response_to: null,
      post_flag: true,
    },
    {
      _id: ObjectId("669a84a2c914e6b7f329d503"), // 固定のObjectIdを指定
      user_id: 7,
      post_date: new Date(Date.now() - 300000), // 5分前
      sentence: "通報される投稿です",
      like_count: 1,
      response_count: 0,
      share_range: [0],
      response_to: null,
      post_flag: false,
    },
    {
      user_id: 4,
      post_date: new Date(Date.now() - 600000), // 10分前
      sentence: "情報処理学科の投稿です。",
      like_count: 0,
      response_count: 0,
      share_range: [0, 5],
      response_to: null,
      post_flag: true,
    },
    {
      _id: ObjectId("669a84a2c914e6b7f329d508"), // 固定のObjectIdを指定
      user_id: 6,
      post_date: new Date(Date.now() - 300000), // 5分前
      sentence:
        "今日から水戸電子専門学校の三年生の主任になりました、よろしくお願いします。",
      like_count: 0,
      response_count: 0,
      share_range: [0, 7],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 7,
      post_date: new Date(Date.now() - 300000), // 5分前
      sentence: "3-A組の担任になりました、よろしくお願いします。",
      like_count: 0,
      response_count: 0,
      share_range: [7, 10],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 10,
      post_date: new Date(Date.now() - 300000),
      sentence: "3-A組のの副担任になりました、よろしくお願いします。",
      like_count: 0,
      response_count: 0,
      share_range: [10],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 8,
      post_date: new Date(Date.now() - 300000),
      sentence: "三年生でもよろしくー！",
      like_count: 0,
      response_count: 0,
      share_range: [7, 10],
      response_to: null,
      post_flag: true,
    },
    {
      user_id: 9,
      post_date: new Date(Date.now() - 300000),
      sentence: "三年生の菊池です。よろしくお願いします！",
      like_count: 0,
      response_count: 0,
      share_range: [7, 10],
      response_to: ObjectId("669a84a2c914e6b7f329d508"),
      post_flag: true,
    },
  ]);
  print("✅ post_collectionに12件挿入しました。");

  // B. profile_collection
  db.profile_collection.insertMany([
    {
      user_id: 1,
      icon: "images/fb82d7cb-cf37-4e31-af5c-ec22d602c402.png",
      nickname: "タロウ",
      show_user_id: "taro_user",
      introduction: "テストユーザー1号です。",
      follow: 5,
      follower: 10,
      filtering: ["ミュートワード"],
    },
    {
      user_id: 2,
      nickname: "ハナコ",
      icon: "images/85f3aeee-3c96-459a-82a5-128956ef0e7d.png",
      show_user_id: "hanako_test",
      introduction: "テストユーザー2号。よろしくお願いします！",
      follow: 10,
      follower: 5,
    },
    {
      user_id: 4,
      nickname: "ジロウ",
      icon: "images/b35909eb-0df0-47aa-ad3a-4448e768aa7f.png",
      show_user_id: "jiro_example",
      introduction: "テストユーザー4号です。勉強頑張ります!",
      follow: 2,
      follower: 3,
    },
    {
      user_id: 5,
      nickname: "イチロウ",
      icon: "images/63b81b67-68ec-4171-a28c-3042a33b8591.png",
      show_user_id: "ichiro_sample",
      introduction: "テストユーザー4号。よろしく!",
      follow: 0,
      follower: 1,
    },
    {
      user_id: 7,
      nickname: "センセイ",
      icon: "images/df7810bd-a128-487c-a389-8d836e35da22.jpg",
      show_user_id: "t003_teacher_w",
      introduction: "数学を教えています。よろしくお願いします。",
      follow: 2,
      follower: 2,
    },
  ]);
  print("✅ profile_collectionに5件挿入しました。");

  // C. search_history_collection
  db.search_history_collection.insertMany([
    {
      user_id: 1,
      search_history: [
        { query: "数学 勉強法", searched_at: new Date() },
        {
          query: "英語 スピーキング",
          searched_at: new Date(Date.now() - 600000),
        },
      ],
    },
    {
      user_id: 3,
      search_history: [
        { query: "テスト対策", searched_at: new Date(Date.now() - 1200000) },
      ],
    },
  ]);
  print("✅ search_history_collectionに2件挿入しました。");

  // D. bookmark_collection
  db.bookmark_collection.insertMany([
    {
      user_id: 1,
      post_id: ObjectId("669a84a2c914e6b7f329d201"),
      bookmarked_at: new Date(),
    },
    {
      user_id: 7,
      post_id: ObjectId("669a84a2c914e6b7f329d201"),
      bookmarked_at: new Date(),
    },
  ]);
  print("✅ bookmark_collectionに2件挿入しました。");

  // E. follow_and_follower_collection
  db.follow_and_follower_collection.insertMany([
    {
      follower_id: 1, //フォローしてる人
      following_id: 2, //フォローされている人
      created_at: new Date(),
    },
    {
      follower_id: 2, //フォローしてる人
      following_id: 1, //フォローされている人
      created_at: new Date(Date.now() - 86400000), // 1日前
    },
    {
      follower_id: 7, //フォローしてる人
      following_id: 2, //フォローされている人
      created_at: new Date(),
    },
    {
      follower_id: 2, //フォローしてる人
      following_id: 7, //フォローされている人
      created_at: new Date(),
    },
    {
      follower_id: 1, //フォローしてる人
      following_id: 7, //フォローされている人
      created_at: new Date(),
    },
    {
      follower_id: 7, //フォローしてる人
      following_id: 1, //フォローされている人
      created_at: new Date(),
    },
  ]);
  print("✅ follow_and_follower_collectionに6件挿入しました。");

  //F like_collection
  db.like_collection.insertMany([
    {
      user_id: 2,
      post_id: ObjectId("669a84a2c914e6b7f329d201"),
      liked_at: new Date(),
    },
    {
      user_id: 1,
      post_id: ObjectId("669a84a2c914e6b7f329d201"),
      liked_at: new Date(),
    },
    {
      user_id: 7,
      post_id: ObjectId("669a84a2c914e6b7f329d201"),
      liked_at: new Date(),
    },
    {
      user_id: 1,
      post_id: ObjectId("669a84a2c914e6b7f329d202"),
      liked_at: new Date(),
    },
  ]);
  print("✅ like_collectionに4件挿入しました。");

  // G.1 classroom_collection
  const c1 = ObjectId();
  const c2 = ObjectId();
  const c3 = ObjectId();

  db.classroom_collection.insertMany([
    {
      _id: c1,
      school_id: 3,
      teacher_id: 7,
      room_name: "Java基礎クラス",
      description: "Javaの文法とOOPを学ぶクラス",
      latest_update: new Date(),
    },
    {
      _id: c2,
      school_id: 3,
      teacher_id: 7,
      room_name: "Webアプリ開発クラス",
      description: "SpringBootとReactでWebアプリを作るクラス",
      latest_update: new Date(),
    },
    {
      _id: c3,
      school_id: 3,
      teacher_id: 7,
      room_name: "データベース設計クラス",
      description: "MySQLとMongoDBの設計を学ぶクラス",
      latest_update: new Date(),
    },
  ]);
  print("✅ classroom_collectionに3件挿入しました。");

  //G.2 classroom_category_collection
  const cat1 = ObjectId();
  const cat2 = ObjectId();
  const cat3 = ObjectId();
  const cat4 = ObjectId();
  const cat5 = ObjectId();
  const cat6 = ObjectId();

  db.classroom_category_collection.insertMany([
    {
      _id: cat1,
      classroom_id: c1,
      categoryname: "基本文法",
      created_date: new Date(),
    },
    {
      _id: cat2,
      classroom_id: c1,
      categoryname: "オブジェクト指向",
      created_date: new Date(),
    },

    {
      _id: cat3,
      classroom_id: c2,
      categoryname: "SpringBoot",
      created_date: new Date(),
    },
    {
      _id: cat4,
      classroom_id: c2,
      categoryname: "React",
      created_date: new Date(),
    },

    {
      _id: cat5,
      classroom_id: c3,
      categoryname: "正規化",
      created_date: new Date(),
    },
    {
      _id: cat6,
      classroom_id: c3,
      categoryname: "インデックス設計",
      created_date: new Date(),
    },
  ]);
  print("✅ classroom_category_collectionに6件挿入しました。");

  //G.3 classroom_document_collection
  db.classroom_document_collection.insertMany([
    {
      classroom_category_id: cat1,
      document_name: "Java変数と型.pdf",
      document_objectKey: "documents/acd6c4e1-c834-483a-ac41-e78b821ad10d.pdf",
      upload_date: new Date(),
    },
    {
      classroom_category_id: cat1,
      document_name: "Java制御構文.pdf",
      document_objectKey: "documents/77ff706c-0697-4a55-b366-130433db3f51.xls",
      upload_date: new Date(),
    },
    {
      classroom_category_id: cat3,
      document_name: "SpringBoot初期構築.pdf",
      document_objectKey: "docs/springboot/setup.pdf",
      upload_date: new Date(),
    },
    {
      classroom_category_id: cat4,
      document_name: "Reactコンポーネント設計.pdf",
      document_objectKey: "docs/react/components.pdf",
      upload_date: new Date(),
    },
    {
      classroom_category_id: cat5,
      document_name: "正規化の基本.pdf",
      document_objectKey: "docs/db/normalize.pdf",
      upload_date: new Date(),
    },
    {
      classroom_category_id: cat6,
      document_name: "インデックス戦略.pdf",
      document_objectKey: "docs/db/index.pdf",
      upload_date: new Date(),
    },
  ]);
  print("✅ classroom_document_collectionに6件挿入しました。");

  // H. report_collection
  db.report_collection.insertMany([
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 8,
      reported_user: 7,
      reason_id: 1,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "不適切な画像を投稿していました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 10,
      reported_user: 7,
      reason_id: 2,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "暴言と誹謗中傷を確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 8,
      reported_user: 7,
      reason_id: 3,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "性的コンテンツを投稿していました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
    {
      school_id: 3,
      report_date: new Date(),
      report_by: 6,
      reported_user: 7,
      reason_id: 4,
      reported_post_id: ObjectId("669a84a2c914e6b7f329d503"),
      detail: "他のユーザに対するいやがらせやいじめを確認しました。",
    },
  ]);
  print("✅ report_collectionに10件挿入しました。");

  // I. reason_collection
  db.reason_collection.insertMany([
    {
      reason_id: 1,
      reason: "不適切なコンテンツ",
    },
    {
      reason_id: 2,
      reason: "スパム/詐欺",
    },
    {
      reason_id: 3,
      reason: "性的コンテンツ",
    },
    {
      reason_id: 4,
      reason: "いやがらせ/いじめ",
    },
    {
      reason_id: 5,
      reason: "その他",
    },
  ]);
  print("✅ reason_collectionに5件挿入しました。");

  // J. notice_collection (お知らせ)
  db.notice_collection.insertMany([
    {
      group_id: 1,
      title: "サービスメンテナンスのお知らせ",
      content: "サーバーメンテナンスを下記の日程で行います。",
      created_at: new Date(Date.now() + 86400000), // 明日
    },
    {
      group_id: 2,
      title: "新機能リリース",
      content: "検索機能が強化されました。",
      created_at: new Date(),
    },
  ]);
  print("✅ notice_collectionに2件挿入しました。");

  // K. inquiry_collection (問い合わせ)
  db.inquiry_collection.insertMany([
    {
      datetime: new Date(),
      subject: "アカウント関連の質問",
      content: "パスワードを忘れてしまいました。",
      mailaddress: "user1@example.com",
      inquiry_status: 1,
    },
    {
      datetime: new Date(Date.now() - 3600000),
      subject: "機能の要望",
      content: "授業資料のアップロード容量を増やしてほしいです。",
      mailaddress: "longemail" + "a".repeat(200) + "@test.co.jp", // 最大長に近いメールアドレス
      inquiry_status: 1,
    },
  ]);
  print("✅ inquiry_collectionに2件挿入しました。");

  print("\n--- 全コレクションへのダミーデータの挿入が完了しました ---");
} catch (e) {
  print(`❌ FAIL: ダミーデータ挿入中にエラーが発生しました: ${e.message}`);
}
