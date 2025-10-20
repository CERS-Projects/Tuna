// サンプルスクリプト

db = db.getSiblingDB("tuna_mongodb");

db.createUser({
  user: "user",
  pwd: "pass",
  roles: [{ role: "readWrite", db: "tuna_mongodb" }],
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
