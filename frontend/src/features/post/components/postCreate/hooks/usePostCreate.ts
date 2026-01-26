import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { createPost } from "@/features/post/api/postApi";

const MAX_IMAGES = 4;
const MAX_LENGTH = 500;

export const usePostCreate = (setIsOpen: (val: boolean) => void) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<"input" | "confirm">("input");
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setPostText("");
    setImages([]);
    setSelectedGroupIds([]);
    setStep("input");
    setSubmitError(null);
    setImageError(null);
  }, [images]);

  const handleTextChange = (text: string) => {
    const clippedText = text.slice(0, MAX_LENGTH);

    setPostText(clippedText);
    if (submitError) setSubmitError(null);
  };

  const onImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const selectedFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (images.length + selectedFiles.length > MAX_IMAGES) {
        setImageError(`画像は最大${MAX_IMAGES}枚です`);
        setTimeout(() => setImageError(null), 3500);
        e.target.value = "";
        return;
      }

      const newImages = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImages]);
      e.target.value = "";
    },
    [images],
  );

  const removeImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const toggleGroup = (id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id)
        ? prev.filter((groupId) => groupId !== id)
        : [...prev, id],
    );
  };

  const handlePost = async (userId: string) => {
    if (isSubmitting) return;

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("sentence", postText);

    if (selectedGroupIds.length > 0) {
      selectedGroupIds.forEach((id) => {
        formData.append("shareRange", id.toString());
      });
    } else {
      formData.append("shareRange", "0");
    }

    images.forEach((img) => {
      formData.append("files", img.file);
    });

    setIsSubmitting(true);
    try {
      const success = await createPost(formData);
      if (success) {
        console.log("投稿が完了しました！");
        resetForm();
        setIsOpen(false);
        navigate("/timeline");
      } else {
        console.log("投稿に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("Post Error:", error);
      console.log("通信エラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };
  const imagesRef = useRef(images);
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  return {
    state: {
      step,
      postText,
      images,
      selectedGroupIds,
      imageError,
      submitError,
      isSubmitting,
      MAX_LENGTH,
    },
    actions: {
      setStep,
      handleTextChange,
      onImageChange,
      removeImage,
      toggleGroup,
      setSubmitError,
      handlePost,
      resetForm,
    },
    refs: {
      fileInputRef,
    },
  } as const;
};
