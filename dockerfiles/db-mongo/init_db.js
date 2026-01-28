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
					"like_Count",
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
						minLength: 3,
						maxLength: 255,
						description: "投稿の本文",
					},
					image_objectKey: {
						bsonType: "array",
						description: "投稿に添付する画像がある場合記録",
					},
					like_Count: {
						bsonType: "int",
						minimum: 0,
						description: "投稿についているいいねの総数",
					},
					response_Count: {
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
						description:
							"論理削除されているかの状態管理 true=未論理削除, false=論理削除済",
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
									maxLength: 100,
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
					"room_id",
					"school_id",
					"teacher_id",
					"room_name",
					"latest_update",
					"categorys",
				],
				properties: {
					room_id: {
						bsonType: "int",
						minimum: 1,
						description: "一意の授業ルームのIDを格納",
					},
					school_id: {
						bsonType: "int",
						minimum: 1,
						description: "MySQLに格納されている一意のschool_idを格納",
					},
					teacher_id: {
						bsonType: "int",
						minimum: 1,
						description: "MySQLに格納されている一意のteacher_idを格納",
					},
					room_name: {
						bsonType: "string",
						minLength: 1,
						maxLength: 50,
						description: "授業ルーム名を格納",
					},
					description: {
						bsonType: "string",
						minLength: 1,
						maxLength: 200,
						description: "授業ルームの概要を格納",
					},
					latest_update: {
						bsonType: "date",
						description: "最終更新日を格納 書式はyyyy-mm-dd-hh-mm-ss-ms",
					},
					categorys: {
						bsonType: "array",
						description: "カテゴリ一覧 要素数は0以上",
						minItems: 0,
						items: {
							bsonType: "object",
							required: ["documents"],
							properties: {
								category: {
									bsonType: "string",
									minLength: 1,
									maxLength: 50,
									description: "カテゴリー名を格納",
								},
								documents: {
									bsonType: "array",
									items: {
										bsonType: "object",
										required: ["name", "document_objectKey", "upload_date"],
										properties: {
											name: {
												bsonType: "string",
												minLength: 1,
												maxLength: 50,
												description: "過去に行った授業資料の題名を格納する",
											},
											document_objectKey: {
												bsonType: "string",
												description: "授業資料が格納されるPathを格納",
											},
											upload_date: {
												bsonType: "date",
												description: "授業資料のアップロード日を格納する",
											},
										},
									},
								},
							},
						},
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
					"report_id",
					"school_id",
					"report_date",
					"report_by",
					"reported_user",
					"reason_id",
					"detail",
				],
				properties: {
					report_id: {
						bsonType: "int",
						minimum: 1,
						description: "一意の通報IDを格納する",
					},
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

	db.createCollection("notion_collection", {
		validator: {
			$jsonSchema: {
				bsonType: "object",
				required: [
					"notice_id",
					"group_id",
					"title",
					"content",
					"reservation_datetime",
				],
				properties: {
					notice_id: {
						bsonType: "int",
						minimum: 1,
						description: "一意のお知らせIDを格納する",
					},
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
					reservation_datetime: {
						bsonType: "date",
						description: "予約時間を格納する 書式はyyyy-mm-dd-hh-mm-ss-ms",
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
			user_id: 101,
			post_date: new Date(),
			sentence: "最初のテスト投稿です。",
			image_objectKey: ["images/6851f5b2-7c82-44b7-bbda-71087b8af9e1.gif"],
			like_Count: 5,
			response_Count: 2,
			share_range: [0, 1, 2, 5, 6],
			response_to: null,
			post_flag: true,
		},
		{
			_id: ObjectId("669a84a2c914e6b7f329d202"), // 固定のObjectIdを指定
			user_id: 101,
			post_date: new Date(Date.now() - 7200000), // 2時間前
			sentence: "返信テスト投稿です。",
			like_Count: 3,
			response_Count: 0,
			share_range: [1, 5, 6],
			post_flag: true,
		},
		{
			user_id: 102,
			post_date: new Date(Date.now() - 1800000), // 30分前
			sentence: "こんにちは！これはテスト投稿です。",
			image_objectKey: [
				"images/5c2808e4-2b7b-457d-ae43-9f8e3f9dd1fb.png",
				"images/63b81b67-68ec-4171-a28c-3042a33b8591.png",
			],
			like_Count: 7,
			response_Count: 0,
			share_range: [0, 1, 3],
			response_to: null,
			post_flag: true,
		},
		{
			user_id: 102,
			post_date: new Date(Date.now() - 2700000), // 45分前
			sentence: "はなこさんの投稿の投稿です！",
			like_Count: 15,
			response_Count: 0,
			share_range: [0, 1, 2, 5, 6],
			response_to: null,
			post_flag: true,
		},
		{
			user_id: 102,
			post_date: new Date(Date.now() - 3600000), // 1時間前
			sentence: "2番目の投稿。画像はありません。",
			like_Count: 10,
			response_Count: 0,
			share_range: [0, 2, 5, 6],
			response_to: ObjectId("669a84a2c914e6b7f329d201"),
			post_flag: true,
		},
		{
			user_id: 103,
			post_date: new Date(Date.now() - 5400000), // 1.5時間前
			sentence: "テスト投稿3番目です！",
			like_Count: 2,
			response_Count: 0,
			share_range: [1, 3],
			response_to: null,
			post_flag: true,
		},
		{
			user_id: 4,
			post_date: new Date(Date.now() - 900000), // 15分前
			sentence: "最後のテスト投稿です。",
			like_Count: 0,
			response_Count: 0,
			share_range: [0],
			response_to: null,
			post_flag: true,
		},
		{
			user_id: 4,
			post_date: new Date(Date.now() - 600000), // 10分前
			sentence: "情報処理学科の投稿です。",
			like_Count: 0,
			response_Count: 0,
			share_range: [5],
			response_to: null,
			post_flag: true,
		},
	]);
	print("✅ post_collectionに6件挿入しました。");

	// B. profile_collection
	db.profile_collection.insertMany([
		{
			user_id: 101,
			icon: "images/63b81b67-68ec-4171-a28c-3042a33b8591.png",
			nickname: "タロウ",
			show_user_id: "taro_user",
			introduction: "テストユーザー1号です。",
			follow: 5,
			follower: 10,
			filtering: ["ミュートワード"],
		},
		{
			user_id: 102,
			nickname: "ハナコ",
			icon: "images/85f3aeee-3c96-459a-82a5-128956ef0e7d.png",
			show_user_id: "hanako_test",
			introduction: "テストユーザー2号。よろしくお願いします！",
			follow: 10,
			follower: 5,
		},
		{
			user_id: 103,
			nickname: "ジロウ",
			icon: "images/b35909eb-0df0-47aa-ad3a-4448e768aa7f.png",
			show_user_id: "jiro_example",
			introduction: "テストユーザー3号です。勉強頑張ります!",
			follow: 2,
			follower: 3,
		},
		{
			user_id: 104,
			nickname: "サブロウ",
			icon: "images/63b81b67-68ec-4171-a28c-3042a33b8591.png",
			show_user_id: "saburo_sample",
			introduction: "テストユーザー4号。よろしく!",
			follow: 0,
			follower: 1,
		},
	]);
	print("✅ profile_collectionに4件挿入しました。");

	// C. search_history_collection
	db.search_history_collection.insertMany([
		{
			user_id: 101,
			search_history: [
				{ query: "数学 勉強法", searched_at: new Date() },
				{
					query: "英語 スピーキング",
					searched_at: new Date(Date.now() - 600000),
				},
			],
		},
		{
			user_id: 103,
			search_history: [
				{ query: "テスト対策", searched_at: new Date(Date.now() - 1200000) },
			],
		},
	]);
	print("✅ search_history_collectionに2件挿入しました。");

	// D. bookmark_collection
	db.bookmark_collection.insertMany([
		{
			user_id: 101,
			post_id: ObjectId("669a84a2c914e6b7f329d201"),
			bookmarked_at: new Date(),
		},
		{
			user_id: 205,
			post_id: ObjectId("669a84a2c914e6b7f329d201"),
			bookmarked_at: new Date(),
		},
	]);
	print("✅ bookmark_collectionに2件挿入しました。");

	// E. follow_and_follower_collection
	db.follow_and_follower_collection.insertMany([
		{
			follower_id: 101, //フォローしてる人
			following_id: 102, //フォローされている人
			created_at: new Date(),
		},
		{
			follower_id: 102, //フォローしてる人
			following_id: 101, //フォローされている人
			created_at: new Date(Date.now() - 86400000), // 1日前
		},
	]);
	print("✅ follow_and_follower_collectionに2件挿入しました。");

	//F like_collection
	db.like_collection.insertMany([
		{
			user_id: 102,
			post_id: ObjectId("669a84a2c914e6b7f329d201"),
			liked_at: new Date(),
		},
		{
			user_id: 101,
			post_id: ObjectId("669a84a2c914e6b7f329d201"),
			liked_at: new Date(),
		},
		{
			user_id: 205,
			post_id: ObjectId("669a84a2c914e6b7f329d201"),
			liked_at: new Date(),
		},
		{
			user_id: 101,
			post_id: ObjectId("669a84a2c914e6b7f329d202"),
			liked_at: new Date(),
		},
	]);
	print("✅ like_collectionに4件挿入しました。");

	// G. classroom_collection
	db.classroom_collection.insertMany([
		{
			room_id: 1,
			school_id: 10,
			teacher_id: 100,
			room_name: "高校数学I",
			description: "基礎から学ぶ数学Iのクラス",
			latest_update: new Date(),
			categorys: [
				{
					category: "図形",
					documents: [
						{
							name: "三角関数資料",
							document_objectKey: "path/fig/doc1.pdf",
							upload_date: new Date(),
						},
					],
				},
			],
		},
		{
			room_id: 2,
			school_id: 10,
			teacher_id: 101,
			room_name: "化学基礎",
			description: "化学の基礎を学びます。",
			latest_update: new Date(),
			categorys: [], // minItems: 0を満たす
		},
	]);
	print("✅ classroom_collectionに2件挿入しました。");

	// H. report_collection
	db.report_collection.insertMany([
		{
			report_id: 100,
			school_id: 10,
			report_date: new Date(),
			report_by: 201,
			reported_user: 202,
			reason_id: 1,
			detail: "不適切な画像を投稿していました。",
		},
		{
			report_id: 101,
			school_id: 10,
			report_date: new Date(),
			report_by: 203,
			reported_user: 204,
			reason_id: 2,
			detail: "暴言と誹謗中傷を確認しました。",
		},
	]);
	print("✅ report_collectionに2件挿入しました。");

	// I. reason_collection
	db.reason_collection.insertMany([
		{
			reason_id: 1,
			reason: "不適切なコンテンツ",
		},
		{
			reason_id: 2,
			reason: "ハラスメント/いじめ",
		},
	]);
	print("✅ reason_collectionに2件挿入しました。");

	// J. notion_collection (お知らせ)
	db.notion_collection.insertMany([
		{
			notice_id: 501,
			group_id: 1,
			title: "サービスメンテナンスのお知らせ",
			content: "サーバーメンテナンスを下記の日程で行います。",
			reservation_datetime: new Date(Date.now() + 86400000), // 明日
		},
		{
			notice_id: 502,
			group_id: 2,
			title: "新機能リリース",
			content: "検索機能が強化されました。",
			reservation_datetime: new Date(),
		},
	]);
	print("✅ notion_collectionに2件挿入しました。");

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
