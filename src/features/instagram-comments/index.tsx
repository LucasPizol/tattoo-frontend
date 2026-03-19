import { PageWrapper } from "@/components/PageWrapper";
import { Table, type Column } from "@/components/ui/Table";
import type { InstagramComment } from "@/features/instagram-comments/types";
import { useInstagramCommentList } from "./http/queries/useInstagramCommentList";
import { Link } from "react-router-dom";

const columns: Column<InstagramComment>[] = [
  {
    key: "username",
    label: "Usuário",
    render: (c) => <span>@{c.username}</span>,
  },
  {
    key: "text",
    label: "Comentário",
  },
  {
    key: "post",
    label: "Post",
    render: (c) => {
      if (!c.post.url) return <span>{c.post.caption}</span>;

      return (
        <Link to={c.post.permalink} target="_blank" rel="noopener noreferrer">
          {c.post.caption}
        </Link>
      );
    },
  },
  {
    key: "account",
    label: "Conta",
    render: (c) => <span>@{c.account.username}</span>,
  },
  {
    key: "createdAt",
    label: "Data",
    render: (c) =>
      new Date(c.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

export const InstagramComments = () => {
  const { comments, isLoading, pagination } = useInstagramCommentList();

  return (
    <PageWrapper
      title="Últimos Comentários"
      subtitle="Comentários recebidos nos posts do Instagram"
    >
      <Table
        columns={columns}
        data={comments}
        loading={isLoading}
        {...pagination}
      />
    </PageWrapper>
  );
};
