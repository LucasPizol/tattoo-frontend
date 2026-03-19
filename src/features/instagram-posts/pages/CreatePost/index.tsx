import { PageWrapper } from "@/components/PageWrapper";
import { Tabs } from "@/components/ui/Tabs";
import {
  InstagramPostSchema,
  type InstagramPostForm,
} from "@/schemas/instagram/posts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { PostFormComponent } from "./components/PostFormComponent";
import { Preview } from "./components/Preview";
import { useInstagramPost } from "../../http/queries/useInstagramPost";

export const PostFormPage = () => {
  const navigate = useNavigate();

  const { post } = useInstagramPost();

  const form = useForm<InstagramPostForm>({
    resolver: zodResolver(InstagramPostSchema.schema),
    defaultValues: InstagramPostSchema.defaultValues,
  });

  useEffect(() => {
    if (post) {
      form.reset({
        caption: post.caption,
        accounts: [
          { value: post.account.id.toString(), label: post.account.username },
        ],
      });
    }
  }, [post]);

  const accountsList = form.watch("accounts");

  return (
    <PageWrapper
      title={post ? "Editar post" : "Criar post"}
      subtitle="Crie uma nova postagem"
      onBack={() => navigate("/instagram/posts")}
    >
      <Tabs>
        <Tabs.Tab label="Formulário">
          <PostFormComponent form={form} post={post} />
        </Tabs.Tab>
        <Tabs.Tab label="Preview">
          <Preview
            contents={[
              ...(post?.contents || []),
              ...(form.watch("contents")?.map((content, index) => ({
                url: URL.createObjectURL(content),
                id: index,
              })) || []),
            ]}
            caption={form.watch("caption")}
            account={{
              username: accountsList[0]?.label,
              profilePictureUrl: "",
            }}
          />
        </Tabs.Tab>
      </Tabs>
    </PageWrapper>
  );
};
