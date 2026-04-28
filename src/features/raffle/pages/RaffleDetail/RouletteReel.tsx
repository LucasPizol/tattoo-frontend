import { useEffect, useRef, useState } from "react";
import styles from "./RouletteReel.module.scss";
import { cn } from "@/utils/cn";

type RouletteReelProps = {
  candidates: string[];
  winner: string;
  durationMs?: number;
  onLand: () => void;
  progressLabel?: string;
};

const randomPick = (arr: string[]): string =>
  arr[Math.floor(Math.random() * arr.length)];

export const RouletteReel = ({
  candidates,
  winner,
  durationMs = 3000,
  onLand,
  progressLabel,
}: RouletteReelProps) => {
  const [currentName, setCurrentName] = useState<string>(() => randomPick(candidates));
  const [flashing, setFlashing] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phase1End = durationMs * 0.6;
  const phase2End = durationMs * (2.6 / 3);
  const flashDuration = 400;

  useEffect(() => {
    const start = performance.now();
    let decelStep = 0;

    const schedule = (delay: number, fn: () => void) => {
      timeoutRef.current = setTimeout(fn, delay);
    };

    const spinPhase = () => {
      const elapsed = performance.now() - start;
      if (elapsed >= phase1End) {
        decelPhase();
        return;
      }
      setCurrentName(randomPick(candidates));
      schedule(60, spinPhase);
    };

    const decelPhase = () => {
      if (decelStep >= 8) {
        landPhase();
        return;
      }
      const interval = 60 + (300 - 60) * (decelStep / 7);
      setCurrentName(randomPick(candidates));
      decelStep++;
      schedule(interval, decelPhase);
    };

    const landPhase = () => {
      setCurrentName(winner);
      setSpinning(false);
      setFlashing(true);
      schedule(flashDuration, () => {
        setFlashing(false);
        onLand();
      });
    };

    schedule(60, spinPhase);

    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
    // intentionally omit candidates/winner from deps — they are stable for a given reel cycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = progressLabel === "Sorteio concluído";

  return (
    <div className={styles.container}>
      {progressLabel && (
        <p
          className={cn(
            styles.progressLabel,
            isDone && styles.progressLabelDone,
          )}
        >
          {progressLabel}
        </p>
      )}

      <div className={cn(styles.focalBar, flashing && styles.focalBarFlash)}>
        <span className={styles.focalName}>{currentName}</span>
      </div>

      <p className={cn(styles.spinningLabel, !spinning && styles.spinningLabelHidden)}>
        SORTEANDO…
      </p>
    </div>
  );
};
