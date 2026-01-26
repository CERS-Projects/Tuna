// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createPost = async (formData: FormData): Promise<boolean> => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/post/insert`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       console.log("投稿完了");
  //       return true;
  //     } else {
  //       console.log("投稿失敗:", response.status);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("通信エラー:", error);
  //     return false;
  //   }
  // };
  const data: Record<string, string | File | (string | File)[]> = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      data[key] = `[File] ${value.name} (${value.size} bytes)`;
    } else {
      data[key] = value;
    }
  });

  console.table(data); // テーブル形式で見やすく表示
  console.log("===================================");

  // サーバー通信の代わりに、少し待ってから成功を返す
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("送信処理が成功しました");
      console.log("共有範囲の全リスト:", formData.getAll("shareRange"));
      console.log("画像の全リスト:", formData.getAll("files"));
      resolve(true);
    }, 800); // 0.8秒待機（通信してるっぽさを出す）
  });
};
