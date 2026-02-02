import { api } from "@/lib/api-client";
import { type CreatePostRequest } from "../types/post";

export const createPost = async (data: CreatePostRequest): Promise<void> => {
  const formData = new FormData();

  formData.append("sentence", data.sentence);

  data.shareRange.forEach((id) => {
    formData.append("shareRange", id.toString());
  });

  if (data.imageFile && data.imageFile.length > 0) {
    data.imageFile.forEach((file) => {
      formData.append("imageFile", file, file.name);
    });
  }

  if (data.responseTo) {
    formData.append("responseTo", data.responseTo.toString());
  }

  await api<void>({
    url: "/posts",
    options: {
      method: "POST",
      body: formData,
    },
  });
};
