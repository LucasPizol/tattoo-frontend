import { cn } from "@/utils/cn";
import { masks } from "@/utils/masks";
import type { CSSProperties } from "react";
import { MdEmojiEvents } from "react-icons/md";
import type { RaffleClient } from "../../types";
import styles from "./WinnerHero.module.scss";

type WinnerHeroProps = {
  winner: RaffleClient;
  index: number;
  compact?: boolean;
  isInstagram?: boolean;
};

const positionLabel = (position: number) => {
  if (position === 1) return "1º Lugar";
  if (position === 2) return "2º Lugar";
  if (position === 3) return "3º Lugar";
  return `${position}º Lugar`;
};

export const WinnerHero = ({
  winner,
  index,
  compact = false,
  isInstagram = false,
}: WinnerHeroProps) => {
  const style = { "--i": index } as CSSProperties;

  const name = isInstagram
    ? winner.instagramComment?.username
      ? `@${winner.instagramComment.username}`
      : `Ganhador #${winner.position}`
    : winner.client?.name ?? `Ganhador #${winner.position}`;

  const meta = isInstagram
    ? winner.instagramComment?.text
    : [
        winner.client?.phone ? masks.formatPhone(winner.client.phone) : null,
        winner.client?.cpf ? masks.formatCpf(winner.client.cpf) : null,
      ]
        .filter(Boolean)
        .join("  ·  ");

  return (
    <div
      className={cn(styles.hero, compact && styles.heroCompact)}
      style={style}
    >
      <div className={styles.iconPuck}>
        <MdEmojiEvents
          size={compact ? 36 : 52}
          className={styles.icon}
          aria-hidden
        />
      </div>

      <div className={styles.body}>
        <p className={styles.eyebrow}>{positionLabel(winner.position)}</p>
        <h2 className={styles.name}>{name}</h2>
        {meta && (
          <p className={cn(styles.meta, isInstagram && styles.metaInstagram)}>
            {meta}
          </p>
        )}
      </div>
    </div>
  );
};
