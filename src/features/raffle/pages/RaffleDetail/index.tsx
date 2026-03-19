import { PageWrapper } from "@/components/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Loading } from "@/components/ui/Loading";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { api } from "@/services/api";
import type { RaffleClient, RaffleShowResponse } from "../../types";
import { masks } from "@/utils/masks";
import { useQuery } from "@tanstack/react-query";
import {
  MdCameraAlt,
  MdCasino,
  MdComment,
  MdEmojiEvents,
  MdFavorite,
  MdFilterList,
  MdPeople,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";

const positionLabel = (position: number) => `${position}º`;

export const RaffleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: raffle, isLoading } = useQuery({
    queryKey: ["raffle", id],
    queryFn: () => api.get<RaffleShowResponse>(`/api/raffles/${Number(id)}`),
    enabled: !!id,
  });

  const primaryWinners =
    raffle?.clients.filter((c) => c.raffleType === "primary") ?? [];
  const secondaryWinners =
    raffle?.clients.filter((c) => c.raffleType === "secondary") ?? [];

  const isInstagramRaffle = !!raffle?.instagramPostId;

  const clientColumns = [
    {
      key: "position",
      label: "Posição",
      width: "80px",
      align: "center" as const,
      render: (rc: RaffleClient) => (
        <span className={styles.position}>{positionLabel(rc.position)}</span>
      ),
    },
    {
      key: "name",
      label: "Nome",
      render: (rc: RaffleClient) => rc.client?.name ?? "-",
    },
    {
      key: "cpf",
      label: "CPF",
      render: (rc: RaffleClient) =>
        rc.client?.cpf ? masks.formatCpf(rc.client.cpf) : "-",
    },
    {
      key: "phone",
      label: "Telefone",
      render: (rc: RaffleClient) =>
        rc.client?.phone ? masks.formatPhone(rc.client.phone) : "-",
    },
    {
      key: "email",
      label: "E-mail",
      render: (rc: RaffleClient) => rc.client?.email ?? "-",
    },
  ];

  const instagramColumns = [
    {
      key: "position",
      label: "Posição",
      width: "80px",
      align: "center" as const,
      render: (rc: RaffleClient) => (
        <span className={styles.position}>{positionLabel(rc.position)}</span>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (rc: RaffleClient) =>
        rc.instagramComment ? `@${rc.instagramComment.username}` : "-",
    },
    {
      key: "comment",
      label: "Comentário",
      render: (rc: RaffleClient) => rc.instagramComment?.text ?? "-",
    },
  ];

  const columns = isInstagramRaffle ? instagramColumns : clientColumns;

  if (isLoading || !raffle) {
    return (
      <div className={styles.loading}>
        <Loading size={40} />
      </div>
    );
  }

  const hasDateFilter = raffle.filters?.start_date && raffle.filters?.end_date;
  const hasProductFilter =
    raffle.filters?.product_ids && raffle.filters.product_ids.length > 0;
  const hasValueFilter = raffle.filters?.min_order_value;

  return (
    <PageWrapper
      title={raffle.name}
      subtitle={
        `Realizado em ${new Date(raffle.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      }
      onBack={() => navigate("/sorteios")}
    >
      <div className={styles.content}>
        <div className={styles.summaryCards}>
          <Card title="" className={styles.summaryCard}>
            <div className={styles.summaryItem}>
              <MdPeople size={28} className={styles.summaryIcon} />
              <div>
                <p className={styles.summaryValue}>{raffle.primaryCount}</p>
                <p className={styles.summaryLabel}>
                  Ganhador{raffle.primaryCount !== 1 ? "es" : ""} Principa
                  {raffle.primaryCount !== 1 ? "is" : "l"}
                </p>
              </div>
            </div>
          </Card>

          {raffle.secondaryCount > 0 && (
            <Card title="" className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <MdPeople size={28} className={styles.summaryIconSecondary} />
                <div>
                  <p className={styles.summaryValue}>{raffle.secondaryCount}</p>
                  <p className={styles.summaryLabel}>
                    Alternativo{raffle.secondaryCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {isInstagramRaffle && raffle.instagramPost && (
            <Card title="" className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <MdCameraAlt size={28} className={styles.summaryIconInstagram} />
                <div className={styles.filterTags}>
                  <p className={styles.summaryLabel}>Post Instagram</p>
                  {raffle.instagramPost.likeCount != null && (
                    <Tag color="gray" size="small">
                      <MdFavorite size={12} style={{ marginRight: 4 }} />
                      {raffle.instagramPost.likeCount} curtidas
                    </Tag>
                  )}
                  {raffle.instagramPost.commentsCount != null && (
                    <Tag color="gray" size="small">
                      <MdComment size={12} style={{ marginRight: 4 }} />
                      {raffle.instagramPost.commentsCount} comentários
                    </Tag>
                  )}
                </div>
              </div>
            </Card>
          )}

          {!isInstagramRaffle && (hasDateFilter || hasProductFilter || hasValueFilter) && (
            <Card title="" className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <MdFilterList size={28} className={styles.summaryIconFilter} />
                <div className={styles.filterTags}>
                  <p className={styles.summaryLabel}>Filtros aplicados</p>
                  {hasDateFilter && (
                    <Tag color="gray" size="small">
                      {new Date(raffle.filters!.start_date! + "T00:00:00").toLocaleDateString(
                        "pt-BR",
                      )}{" "}
                      —{" "}
                      {new Date(raffle.filters!.end_date! + "T00:00:00").toLocaleDateString(
                        "pt-BR",
                      )}
                    </Tag>
                  )}
                  {hasValueFilter && (
                    <Tag color="gray" size="small">
                      Mín. R$ {raffle.filters!.min_order_value}
                    </Tag>
                  )}
                  {hasProductFilter && (
                    <Tag color="gray" size="small">
                      {raffle.filters!.product_ids!.length} produto(s)
                    </Tag>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {isInstagramRaffle && raffle.instagramPost && (
          <Card title="Post Vinculado" icon={<MdCameraAlt />} className={styles.tableCard}>
            <p className={styles.secondaryNote}>{raffle.instagramPost.caption}</p>
          </Card>
        )}

        {primaryWinners.length > 0 && (
          <Card
            title="Ganhadores Principais"
            icon={<MdEmojiEvents />}
            className={styles.tableCard}
          >
            <Table columns={columns} data={primaryWinners} />
          </Card>
        )}

        {secondaryWinners.length > 0 && (
          <>
            <Divider />
            <Card
              title="Ganhadores Alternativos"
              icon={<MdCasino />}
              className={styles.tableCard}
            >
              <p className={styles.secondaryNote}>
                {isInstagramRaffle
                  ? "Estes comentaristas serão convocados caso algum ganhador principal seja inválido."
                  : "Estes clientes serão convocados caso algum ganhador principal seja inválido ou não possa participar."}
              </p>
              <Table columns={columns} data={secondaryWinners} />
            </Card>
          </>
        )}

        {primaryWinners.length === 0 && secondaryWinners.length === 0 && (
          <Card title="" className={styles.emptyCard}>
            <div className={styles.emptyState}>
              <MdCasino size={48} className={styles.emptyIcon} />
              <p>Nenhum{isInstagramRaffle ? " comentarista" : " cliente"} foi sorteado.</p>
              <p className={styles.emptyHint}>
                {isInstagramRaffle
                  ? "Verifique se o post possui comentários elegíveis."
                  : "Verifique se os filtros configurados correspondem a clientes existentes."}
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};
