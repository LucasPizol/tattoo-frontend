import { ConfirmModal } from "@/components/ConfirmModal";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import type { Raffle } from "./types";
import { useState } from "react";
import { MdAdd, MdDelete, MdVisibility } from "react-icons/md";
import { useDeleteRaffle } from "./http/mutations/raffleMutations";
import { useRaffleListQuery } from "./http/queries/raffleQuery";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";

const formatFilters = (raffle: Raffle) => {
  if (raffle.instagramPostId) return "Via Instagram";
  if (!raffle.filters) return "Sem filtros";
  const parts: string[] = [];
  if (raffle.filters.start_date && raffle.filters.end_date) {
    const start = new Date(raffle.filters.start_date).toLocaleDateString("pt-BR");
    const end = new Date(raffle.filters.end_date).toLocaleDateString("pt-BR");
    parts.push(`${start} - ${end}`);
  }
  if (raffle.filters.min_order_value) {
    parts.push(`Mín. R$ ${raffle.filters.min_order_value}`);
  }
  if (raffle.filters.product_ids && raffle.filters.product_ids.length > 0) {
    parts.push(`${raffle.filters.product_ids.length} produto(s)`);
  }
  return parts.length > 0 ? parts.join(" | ") : "Sem filtros";
};

export const RaffleList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useRaffleListQuery(page);
  const { mutateAsync: deleteRaffle } = useDeleteRaffle();

  const columns = [
    {
      key: "name",
      label: "Nome",
      minWidth: "180px",
    },
    {
      key: "primaryCount",
      label: "Ganhadores",
      render: (raffle: Raffle) => (
        <div className={styles.countBadges}>
          <Tag color="green" size="small">
            {raffle.primaryCount} principal
            {raffle.primaryCount !== 1 ? "is" : ""}
          </Tag>
          {raffle.secondaryCount > 0 && (
            <Tag color="blue" size="small">
              {raffle.secondaryCount} alternativo
              {raffle.secondaryCount !== 1 ? "s" : ""}
            </Tag>
          )}
        </div>
      ),
    },
    {
      key: "filters",
      label: "Filtros",
      render: (raffle: Raffle) => (
        <span className={styles.filterSummary}>{formatFilters(raffle)}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Realizado em",
      render: (raffle: Raffle) =>
        new Date(raffle.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actions",
      label: "Ações",
      width: "auto",
      padding: "0px",
      align: "center" as const,
      render: (raffle: Raffle) => (
        <div className={styles.actions}>
          <IconButton
            title="Ver resultado"
            onClick={() => navigate(`/sorteios/${raffle.id}`)}
          >
            <MdVisibility size={22} />
          </IconButton>
          <ConfirmModal
            onSave={async () => {
              await deleteRaffle(raffle.id)
            }}
            title="Excluir Sorteio"
            trigger={
              <IconButton title="Excluir">
                <MdDelete size={22} />
              </IconButton>
            }
          >
            <p>Tem certeza que deseja excluir o sorteio "{raffle.name}"?</p>
          </ConfirmModal>
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Sorteios"
      subtitle="Realize sorteios entre seus clientes com filtros personalizados"
      actions={
        <Button prefixIcon={<MdAdd />} onClick={() => navigate("/sorteios/novo")}>
          Novo Sorteio
        </Button>
      }
    >
      <Table
        columns={columns}
        data={data?.data ?? []}
        loading={isLoading}
        pagination={
          data
            ? {
                page,
                perPage: 20,
                totalPages: data.totalPages,
                onChange: (p) => setPage(p),
              }
            : undefined
        }
      />
    </PageWrapper>
  );
};
