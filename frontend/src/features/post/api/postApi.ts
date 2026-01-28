export const createPost = async (formData: FormData): Promise<boolean> => {
  const data: Record<string, string | File | (string | File)[]> = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      data[key] = `[File] ${value.name} (${value.size} bytes)`;
    } else {
      data[key] = value;
    }
  });

  console.table(data);
  console.log("===================================");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("送信処理が成功しました");
      console.log("共有範囲の全リスト:", formData.getAll("shareRange"));
      console.log("画像の全リスト:", formData.getAll("files"));
      resolve(true);
    }, 800);
  });
};
