import { Form } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { TextArea } from "@/components/ui/TextArea";
import { useInstagramAccountList } from "@/features/instagram-posts/http/queries/useInstagramAccountList";
import {
  InstagramPostSchema,
  type InstagramPostForm,
} from "@/schemas/instagram/posts";
import { api } from "@/services/api";
import type { InstagramPost } from "@/features/instagram-posts/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaMagic } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const INSTAGRAM_MIN_ASPECT_RATIO = 0.8;
const INSTAGRAM_MAX_ASPECT_RATIO = 1.91;
const INSTAGRAM_MAX_FILE_SIZE = 8 * 1024 * 1024;

type ImageDimensions = {
  width: number;
  height: number;
};

const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar a imagem"));
    };

    img.src = url;
  });
};

type PostFormComponentProps = {
  form: UseFormReturn<InstagramPostForm>;
  post?: InstagramPost;
};

export const PostFormComponent = ({ form, post }: PostFormComponentProps) => {
  const { accounts } = useInstagramAccountList();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();

  const validateInstagramImage = useCallback(
    async (file: File): Promise<true | string> => {
      if (file.size > INSTAGRAM_MAX_FILE_SIZE) {
        return `Arquivo muito grande. Máximo: 8MB`;
      }

      if (!file.type.startsWith("image/")) {
        return true;
      }

      try {
        const { width, height } = await getImageDimensions(file);
        const aspectRatio = width / height;

        if (aspectRatio < INSTAGRAM_MIN_ASPECT_RATIO) {
          return `Proporção muito vertical)`;
        }

        if (aspectRatio > INSTAGRAM_MAX_ASPECT_RATIO) {
          return `Proporção muito horizontal`;
        }

        return true;
      } catch {
        return "Não foi possível validar a imagem";
      }
    },
    [],
  );

  const { mutateAsync: generateContent, isPending: isGeneratingContent } =
    useMutation({
      mutationFn: async () => {
        const formData = new FormData();
        formData.append("instagram_post[caption]", form.getValues("caption"));
        form.getValues("contents").forEach((content) => {
          formData.append("instagram_post[contents][]", content);
        });
        const { content } = await api.post<{ content: string }>(
          `/api/instagram/posts/${parseInt(id || "0")}/generate_content`,
          formData,
        );
        return content;
      },
      onSuccess: (content) => {
        form.setValue("caption", content);
      },
      onError: () => {
        toast.error("Erro ao gerar conteúdo");
      },
    });

  const onSubmit = async (data: InstagramPostForm) => {
    if (post) {
      const formData = new FormData();
      data.contents.forEach((content) => {
        formData.append("post[contents][]", content);
      });
      formData.append("post[caption]", data.caption);
      await api.put<InstagramPost>(`/api/instagram/posts/${post.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const formData = new FormData();
      data.contents.forEach((content) => {
        formData.append("post[contents][]", content);
      });
      formData.append("post[caption]", data.caption);
      data.accounts.forEach((account) => {
        formData.append("post[instagram_account_ids][]", account.value.toString());
      });
      await api.post<InstagramPost>("/api/instagram/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    toast.success("Post criado com sucesso");
    form.reset(InstagramPostSchema.defaultValues);
    queryClient.invalidateQueries({
      predicate: (query) =>
        typeof query.queryKey?.[0] === "string" &&
        query.queryKey[0].toLowerCase().includes("instagram-posts"),
    });
    navigate("/instagram/posts");
  };

  return (
    <Form onSubmit={onSubmit} form={form} className={styles.form}>
      <ImageUpload
        label="Imagem"
        accept="image/*,video/*"
        onChange={(files) => {
          form.setValue("contents", files);
        }}
        error={form.formState.errors.contents?.message}
        initialImages={form.getValues("contents")}
        imagesData={post?.contents}
        validateFile={validateInstagramImage}
        onRemoveImageWithId={(id) => {
          api.delete<void>(`/api/attached_images/${id}`);
        }}
      />
      <TextArea label="Legenda" field="caption" rows={10} />
      <IconButton
        type="button"
        style={{ alignSelf: "flex-start" }}
        onClick={async () => {
          await generateContent();
        }}
        loading={isGeneratingContent}
        disabled={isGeneratingContent}
      >
        <FaMagic size={18} />
      </IconButton>
      {!id && (
        <MultiSelect
          label="Contas"
          options={accounts?.map((account) => ({
            label: account.username,
            value: account.id.toString(),
            profilePictureUrl: account.profilePictureUrl,
          }))}
          field="accounts"
        />
      )}
      <Button type="submit" loading={form.formState.isSubmitting}>
        {post ? "Editar post" : "Criar post"}
      </Button>
    </Form>
  );
};
