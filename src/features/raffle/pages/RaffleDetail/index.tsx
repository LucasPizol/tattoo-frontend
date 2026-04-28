import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Loading } from "@/components/ui/Loading";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { api } from "@/services/api";
import type { RaffleClient, RaffleShowResponse } from "../../types";
import { masks } from "@/utils/masks";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
  MdCameraAlt,
  MdCasino,
  MdComment,
  MdEmojiEvents,
  MdFavorite,
  MdFilterList,
  MdPeople,
  MdRefresh,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { WinnerHero } from "./WinnerHero";
import { DrawCta } from "./DrawCta";
import { RouletteReel } from "./RouletteReel";
import { useDrawRaffle } from "../../http/mutations/raffleMutations";
import styles from "./styles.module.scss";
import reelStyles from "./RouletteReel.module.scss";

const positionLabel = (position: number) => `${position}º`;

export const RaffleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: raffle, isLoading } = useQuery({
    queryKey: ["raffle", id],
    queryFn: () => api.get<RaffleShowResponse>(`/api/raffles/${Number(id)}`),
    enabled: !!id,
  });

  const drawMutation = useDrawRaffle(id!);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnData, setDrawnData] = useState<RaffleShowResponse | null>(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [revealedWinners, setRevealedWinners] = useState<RaffleClient[]>([]);
  const [drawError, setDrawError] = useState(false);
  const [showDoneLabel, setShowDoneLabel] = useState(false);

  const primaryWinners =
    (drawnData ?? raffle)?.clients.filter((c) => c.raffleType === "primary") ?? [];
  const secondaryWinners =
    (drawnData ?? raffle)?.clients.filter((c) => c.raffleType === "secondary") ?? [];

  const isInstagramRaffle = !!raffle?.instagramPostId;

  const totalToAnimate =
    primaryWinners.length <= 3 ? primaryWinners.length : 1;

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

  const winnerDisplayName = (rc: RaffleClient): string => {
    if (isInstagramRaffle) {
      return rc.instagramComment?.username
        ? `@${rc.instagramComment.username}`
        : `Ganhador #${rc.position}`;
    }
    return rc.client?.name ?? `Ganhador #${rc.position}`;
  };

  const handleDraw = useCallback(() => {
    setIsDrawing(true);
    setDrawError(false);
    setRevealIndex(0);
    setRevealedWinners([]);
    setShowDoneLabel(false);
    drawMutation.mutate(undefined, {
      onSuccess: (data) => setDrawnData(data),
      onError: () => setDrawError(true),
    });
  }, [drawMutation]);

  const handleRetry = useCallback(() => {
    setDrawError(false);
    drawMutation.mutate(undefined, {
      onSuccess: (data) => setDrawnData(data),
      onError: () => setDrawError(true),
    });
  }, [drawMutation]);

  const handleLand = useCallback(() => {
    const landedWinner = primaryWinners[revealIndex];
    const nextIndex = revealIndex + 1;

    if (landedWinner && nextIndex <= totalToAnimate) {
      setRevealedWinners((prev) => [...prev, landedWinner]);
    }

    if (nextIndex >= totalToAnimate) {
      setShowDoneLabel(true);
      setTimeout(() => {
        setIsDrawing(false);
      }, 1500);
    } else {
      setRevealIndex(nextIndex);
    }
  }, [primaryWinners, revealIndex, totalToAnimate]);

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

  const isPending = raffle.status === "pending";
  const isAnimationComplete = !isDrawing && drawnData !== null;

  const subtitle =
    !isDrawing && isPending && !isAnimationComplete
      ? "Aguardando sorteio"
      : `Realizado em ${new Date(raffle.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`;

  const summaryAndPostCards = (
    <>
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
    </>
  );

  const drawnLayout = (
    <>
      {summaryAndPostCards}

      {primaryWinners.length > 0 && (
        <div className={styles.heroWrap}>
          {primaryWinners
            .slice(0, primaryWinners.length <= 3 ? primaryWinners.length : 1)
            .map((w, i) => (
              <WinnerHero
                key={w.id}
                winner={w}
                index={i}
                compact={primaryWinners.length > 1}
                isInstagram={isInstagramRaffle}
              />
            ))}
        </div>
      )}

      {primaryWinners.length > 3 && (
        <Card
          title="Demais Ganhadores Principais"
          icon={<MdEmojiEvents />}
          className={styles.tableCard}
        >
          <Table
            columns={columns}
            data={primaryWinners.filter((w) => w.position !== 1)}
          />
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
    </>
  );

  const currentWinner = drawnData ? primaryWinners[revealIndex] : null;
  const progressLabel = showDoneLabel
    ? "Sorteio concluído"
    : `Sorteando ${revealIndex + 1}º de ${totalToAnimate}...`;

  const drawingLayout = (
    <>
      {summaryAndPostCards}

      {drawError ? (
        <div className={reelStyles.container} style={{ alignItems: "center", textAlign: "center", gap: 16 }}>
          <MdRefresh size={32} style={{ color: "var(--amber)" }} />
          <p style={{ color: "var(--text-inverse)", fontSize: 15, fontWeight: 600, margin: 0 }}>
            Algo deu errado no sorteio.
          </p>
          <p style={{ color: "var(--text-inverse-dim)", fontSize: 13, margin: 0 }}>
            Tente novamente ou recarregue a página.
          </p>
          <Button variant="primary" onClick={handleRetry}>
            Tentar novamente
          </Button>
        </div>
      ) : !drawnData ? (
        <div className={styles.loading}>
          <Loading size={40} />
        </div>
      ) : currentWinner ? (
        <>
          <RouletteReel
            candidates={raffle.sampleCandidates ?? [winnerDisplayName(currentWinner)]}
            winner={winnerDisplayName(currentWinner)}
            onLand={handleLand}
            progressLabel={progressLabel}
          />
          {revealedWinners.length > 0 && (
            <div className={styles.heroWrap}>
              {revealedWinners.map((w, i) => (
                <WinnerHero
                  key={w.id}
                  winner={w}
                  index={i}
                  compact={revealedWinners.length > 1}
                  isInstagram={isInstagramRaffle}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </>
  );

  const renderContent = () => {
    if (!isDrawing && (raffle.status === "drawn" || isAnimationComplete)) {
      return drawnLayout;
    }
    if (isDrawing) {
      return drawingLayout;
    }
    return (
      <>
        {summaryAndPostCards}
        <DrawCta
          poolSize={raffle.poolSize ?? 0}
          primaryCount={raffle.primaryCount}
          secondaryCount={raffle.secondaryCount}
          onDraw={handleDraw}
          isLoading={drawMutation.isPending}
        />
      </>
    );
  };

  return (
    <PageWrapper
      title={raffle.name}
      subtitle={subtitle}
      onBack={() => navigate("/sorteios")}
    >
      <div className={styles.content}>
        {renderContent()}
      </div>
    </PageWrapper>
  );
};
