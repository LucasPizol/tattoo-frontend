import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Modal, type ModalPropsNoForm } from "@/components/ui/Modal";
import { Table, type Column } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { api } from "@/services/api";
import type { PaginationResponse } from "@/models/Pagination";
import type { InstagramPost } from "@/features/instagram-posts/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MdComment, MdFavorite } from "react-icons/md";
import styles from "./styles.module.scss";
import { Button } from "@/components/ui/Button";

type InstagramPostSelectionModalProps = ModalPropsNoForm<null> & {
  onSelect: (post: InstagramPost) => void;
};

export const InstagramPostSelectionModal = ({
  onSelect,
  ...modalProps
}: InstagramPostSelectionModalProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["instagram-posts-modal", page],
    queryFn: () => api.get<PaginationResponse<InstagramPost>>("/api/instagram/posts", { page, per_page: 10 }),
    enabled: modalProps.isOpen,
  });

  const columns: Column<InstagramPost>[] = [
    {
      key: "thumbnail",
      label: " ",
      maxWidth: "80px",
      render: (post) => {
        const hasContents = post.contents.length > 0;

        if (hasContents) {
          return (
            <ImagePreview
              images={post.contents.map((c) => ({
                url: c.url,
                id: c.id,
              }))}
              maxWidth="60px"
              maxHeight="60px"
            />
          );
        }

        return (
          <ImagePreview
            images={[{ url: post.url, id: 0 }]}
            maxWidth="60px"
            maxHeight="60px"
          />
        );
      },
    },
    {
      key: "caption",
      label: "Legenda",
    },
    {
      key: "likeCount",
      label: "Curtidas",
      maxWidth: "100px",
      render: (post) => (
        <span className={styles.metric}>
          <MdFavorite size={15} className={styles.metricIconLike} />
          {post.likeCount ?? "-"}
        </span>
      ),
    },
    {
      key: "commentsCount",
      label: "Comentários",
      maxWidth: "120px",
      render: (post) => (
        <span className={styles.metric}>
          <MdComment size={15} className={styles.metricIconComment} />
          {post.commentsCount ?? "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      maxWidth: "120px",
      render: (post) =>
        post.status === "published" ? (
          <Tag color="green" size="small">
            Publicado
          </Tag>
        ) : (
          <Tag color="gray" size="small">
            {post.status}
          </Tag>
        ),
    },
    {
      key: "select",
      label: " ",
      render: (post) => (
        <Button
          className={styles.selectBtn}
          onClick={() => {
            onSelect(post);
            modalProps.onClose();
          }}
        >
          Selecionar
        </Button>
      ),
    },
  ];

  return (
    <Modal
      {...modalProps}
      title="Selecionar Post do Instagram"
      showFooter={false}
      size="large"
    >
      <div className={styles.content}>
        <Table
          columns={columns}
          data={data?.data ?? []}
          loading={isLoading}
          pagination={
            data
              ? {
                  page,
                  perPage: 10,
                  totalPages: data.totalPages,
                  onChange: (p) => setPage(p),
                }
              : undefined
          }
        />
      </div>
    </Modal>
  );
};
