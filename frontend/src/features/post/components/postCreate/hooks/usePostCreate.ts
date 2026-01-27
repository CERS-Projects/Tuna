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
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    setPostText("");
    setImages([]);
    setSelectedGroupIds([]);
    setStep("input");
    setSubmitError(null);
    setImageError(null);
  }, []);

  const handleTextChange = useCallback((text: string) => {
    const clippedText = text.slice(0, MAX_LENGTH);

    setPostText(clippedText);
    if (submitError) setSubmitError(null);
  }, []);

  const onImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const selectedFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );
      setImages((prev) => {
        if (prev.length + selectedFiles.length > MAX_IMAGES) {
          setImageError(`画像は最大${MAX_IMAGES}枚です`);
          setTimeout(() => setImageError(null), 3500);
          return prev;
        }

        const newImages = selectedFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        }));
        return [...prev, ...newImages];
      });
      e.target.value = "";
      // setImages((prev) => [...prev, ...newImages]);
      // e.target.value = "";
    },
    [],
  );

  const removeImage = useCallback((url: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.url === url);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.url !== url);
    });
  }, []);

  const toggleGroup = useCallback((id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id)
        ? prev.filter((groupId) => groupId !== id)
        : [...prev, id],
    );
  }, []);

  const handlePost = useCallback(
    async (userId: string) => {
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
    },
    [
      postText,
      images,
      selectedGroupIds,
      isSubmitting,
      navigate,
      setIsOpen,
      resetForm,
    ],
  );
  const imagesRef = useRef(images);
  // useEffect(() => {
  //   return () => {
  //     imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
  //   };
  // }, []);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
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
      setPostText,
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
