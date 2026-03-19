import { PageWrapper } from "@/components/PageWrapper";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Table, type Column } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import type { InstagramPost } from "./types";
import { MdComment, MdFavorite } from "react-icons/md";
import styles from "./styles.module.scss";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useInstagramPostList } from "./http/queries/useInstagramPostList";
import { ConfirmModal } from "@/components/ConfirmModal";
import { usePublishInstagramPost } from "./http/mutations/usePublishInstagramPost";

const statusLabel = (status: InstagramPost["status"]) => {
  switch (status) {
    case "published":
      return <Tag color="green">Publicado</Tag>;
    case "publishing":
      return <Tag color="yellow">Publicando</Tag>;
    case "failed":
      return <Tag color="red">Falhou</Tag>;
    default:
      return <Tag color="gray">Rascunho</Tag>;
  }
};

export const InstagramPosts = () => {
  const navigate = useNavigate();
  const { posts, isLoading, pagination } = useInstagramPostList();
  const { mutateAsync: publishPost } = usePublishInstagramPost();

  const columns: Column<InstagramPost>[] = [
    {
      key: "thumbnail",
      label: " ",
      maxWidth: "100px",
      render: (post) => {
        const hasContents = post.contents.length > 0;
        const hasMediaUrl = post.url;

        if (hasContents) {
          return (
            <ImagePreview
              images={post.contents.map((c) => ({
                url: c.url,
                id: c.id,
              }))}
              clickable
              maxWidth="72px"
              maxHeight="72px"
            />
          );
        }

        if (hasMediaUrl) {
          return (
            <ImagePreview
              images={[{ url: post.url, id: 0 }]}
              clickable
              maxWidth="72px"
              maxHeight="72px"
            />
          );
        }
      },
    },
    {
      key: "caption",
      label: "Legenda",
      render: (post) => {
        if (!post.permalink) return <span>{post.caption}</span>;

        return (
          <Link to={post.permalink} target="_blank" rel="noopener noreferrer">
            {post.caption}
          </Link>
        );
      },
    },
    {
      key: "likeCount",
      label: "Curtidas",
      render: (post) => (
        <span className={styles.metric}>
          <MdFavorite size={16} className={styles.metricIconLike} />
          {post.likeCount ?? "-"}
        </span>
      ),
    },
    {
      key: "commentsCount",
      label: "Comentários",
      render: (post) => (
        <span className={styles.metric}>
          <MdComment size={16} className={styles.metricIconComment} />
          {post.commentsCount ?? "-"}
        </span>
      ),
    },
    {
      key: "account",
      label: "Conta",
      render: (post) => <span>@{post.account.username}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (post) => statusLabel(post.status),
    },
    {
      key: "publishedAt",
      label: "Publicado em",
      render: (post) => <span>{post.publishedAt ?? "-"}</span>,
    },
    {
      key: "actions",
      label: "Ações",
      render: (post) => {
        if (post.status === "published") return null;

        if (post.status === "publishing")
          return <Button disabled>Publicando</Button>;

        return (
          <ConfirmModal
            onSave={async () => {
              await publishPost(post.id);
            }}
            title="Publicar post"
            trigger={<Button>Publicar</Button>}
          >
            <p>Tem certeza que deseja publicar o post?</p>
          </ConfirmModal>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Posts Instagram"
      subtitle="Visualize seus posts publicados e suas métricas"
      actions={
        <Button onClick={() => navigate("/instagram/posts/criar")}>
          Criar post
        </Button>
      }
    >
      <Table
        columns={columns}
        data={posts}
        loading={isLoading}
        {...pagination}
      />
    </PageWrapper>
  );
};
