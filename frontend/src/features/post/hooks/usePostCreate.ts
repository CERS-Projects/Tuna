import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreatePost } from "@/features/post/hooks/useCreatePost";
import { type PostFormData } from "@/features/post/types/post";
import { type ImageData } from "@/features/post/types/post";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

const MAX_IMAGES = 4;
const MAX_LENGTH = 255;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const usePostCreate = (setIsOpen: (val: boolean) => void) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "confirm">("input");
  const [images, setImages] = useState<ImageData[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef(images);

  const form = useForm<PostFormData>({
    defaultValues: {
      sentence: "",
      shareRange: [],
      responseTo: undefined,
    },
    mode: "onChange",
  });

  const { watch, setValue, reset, formState } = form;
  const sentence = watch("sentence");
  const shareRange = watch("shareRange");

  const createPostMutation = useCreatePost({
    onSuccess: () => {
      resetForm();
      setIsOpen(false);
      navigate(paths.app.timeline.path, { replace: true });
    },
    onError: () => {
      setValidationError("投稿に失敗しました");
    },
  });

  const resetForm = useCallback(() => {
    imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setStep("input");
    setImageError(null);
    setValidationError(null);
    reset();
  }, [reset]);

  const handleTextChange = useCallback(
    (text: string) => {
      const clippedText = text.slice(0, MAX_LENGTH);
      setValue("sentence", clippedText, { shouldValidate: true });
      if (validationError) setValidationError(null);
    },
    [setValue, validationError],
  );

  const onImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const selectedFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );

      const oversizedFiles = selectedFiles.filter(
        (f) => f.size > MAX_FILE_SIZE,
      );
      if (oversizedFiles.length > 0) {
        setImageError("画像は1枚あたり5MBまでです");
        setTimeout(() => setImageError(null), 3500);
        e.target.value = "";
        return;
      }

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

  const toggleGroup = useCallback(
    (ids: number[], isSelect: boolean) => {
      const currentIds = shareRange;
      if (isSelect) {
        const newIds = new Set([...currentIds, ...ids]);
        setValue("shareRange", Array.from(newIds));
      } else {
        setValue(
          "shareRange",
          currentIds.filter((id) => !ids.includes(id)),
        );
      }
    },
    [shareRange, setValue],
  );

  const handlePost = useCallback(() => {
    if (createPostMutation.isPending) return;

    const trimmedSentence = form.getValues("sentence").trim();
    if (!trimmedSentence) {
      setValidationError("投稿内容を入力してください");
      return;
    }

    const formData = form.getValues();
    const currentImages = imagesRef.current;

    console.log("投稿データ:", {
      sentence: formData.sentence,
      imageFile: currentImages.map((img) => ({
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
        isFile: img.file instanceof File,
      })),
      shareRange: formData.shareRange.length > 0 ? formData.shareRange : [0],
      ...(formData.responseTo && { responseTo: formData.responseTo }),
    });

    const imageFiles = currentImages.map((img) => img.file);

    createPostMutation.mutate({
      sentence: trimmedSentence,
      imageFile: imageFiles.length > 0 ? imageFiles : undefined,
      shareRange: formData.shareRange.length > 0 ? formData.shareRange : [0],
      ...(formData.responseTo && { responseTo: formData.responseTo }),
    });
  }, [createPostMutation, form]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  const submitError = validationError ?? null;

  return {
    form,
    state: {
      step,
      postText: sentence,
      images,
      selectedGroupIds: shareRange,
      imageError,
      submitError,
      isSubmitting: createPostMutation.isPending,
      MAX_LENGTH,
      isValid: formState.isValid,
    },
    actions: {
      setStep,
      handleTextChange,
      onImageChange,
      removeImage,
      toggleGroup,
      handlePost,
      resetForm,
      setPostText: (text: string) => setValue("sentence", text),
      setSubmitError: setValidationError,
    },
    refs: {
      fileInputRef,
    },
  } as const;
};
