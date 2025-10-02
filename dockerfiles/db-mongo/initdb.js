// サンプルスクリプト

db = db.getSiblingDB("db_test_mongo");

db.createUser({
  user: "app_user",
  pwd: "app_pass",
  roles: [{ role: "readWrite", db: "db_test_mongo" }],
});

db.todos.insertMany([
  {
    content: "食材を買う",
    created_date: new Date(),
    completed_date: new Date(),
  },
  {
    content: "報告書を仕上げる",
    created_date: new Date(),
    completed_date: new Date(),
  },
  {
    content: "運動する",
    created_date: new Date(),
    completed_date: new Date(),
  },
  {
    content: "本を読む",
    created_date: new Date(),
    completed_date: null,
  },
  {
    content: "請求書を支払う",
    created_date: new Date(),
    completed_date: null,
  },
  {
    content: "家を掃除する",
    created_date: new Date(),
    completed_date: null,
  },
  {
    content: "プレゼンの準備する",
    created_date: new Date(),
    completed_date: null,
  },
  {
    content: "コードを書く",
    created_date: new Date(),
    completed_date: null,
  },
]);
