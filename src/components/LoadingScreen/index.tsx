import { useEffect, useState } from "react";
import { Loading } from "../ui/Loading";
import styles from "./styles.module.scss";

interface LoadingScreenProps {
  message?: string;
  variant?: "rainbow" | "pulse" | "dots" | "spinner" | "skeleton";
  size?: "small" | "medium" | "large";
  showProgress?: boolean;
  progress?: number;
  onComplete?: () => void;
  className?: string;
}

export const LoadingScreen = ({
  message = "Carregando...",
  variant = "rainbow",
  size = "medium",
  showProgress = false,
  progress = 0,
  onComplete,
  className,
}: LoadingScreenProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingMessages] = useState([
    "Preparando...",
    "Carregando dados...",
    "Quase lá...",
    "Finalizando...",
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (showProgress && progress > 0) {
      setCurrentProgress(progress);

      if (progress >= 100 && onComplete) {
        setTimeout(onComplete, 500);
      }
    }
  }, [progress, showProgress, onComplete]);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showProgress, loadingMessages.length]);

  const renderLoadingVariant = () => {
    switch (variant) {
      case "rainbow":
        return (
          <div className={styles.rainbowContainer}>
            <div className={styles.rainbow}>
              <div className={styles.rainbowBar} style={{ animationDelay: "0s" }}></div>
              <div className={styles.rainbowBar} style={{ animationDelay: "0.1s" }}></div>
              <div className={styles.rainbowBar} style={{ animationDelay: "0.2s" }}></div>
              <div className={styles.rainbowBar} style={{ animationDelay: "0.3s" }}></div>
              <div className={styles.rainbowBar} style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        );

      case "pulse":
        return (
          <div className={styles.pulseContainer}>
            <div className={styles.pulse}></div>
            <div className={styles.pulse} style={{ animationDelay: "0.2s" }}></div>
            <div className={styles.pulse} style={{ animationDelay: "0.4s" }}></div>
          </div>
        );

      case "dots":
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot} style={{ animationDelay: "0.2s" }}></div>
            <div className={styles.dot} style={{ animationDelay: "0.4s" }}></div>
          </div>
        );

      case "spinner":
        return (
          <div className={styles.spinnerContainer}>
            <Loading
              size={size === "small" ? 24 : size === "large" ? 48 : 36}
              color="var(--color-primary)"
            />
          </div>
        );

      case "skeleton":
        return (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonHeader}></div>
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLine} style={{ width: "80%" }}></div>
                <div className={styles.skeletonLine} style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        );

      default:
        return <Loading size={36} />;
    }
  };

  return (
    <div className={`${styles.loadingScreen} ${className || ""}`}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingAnimation}>
          {renderLoadingVariant()}
        </div>

        <div className={styles.loadingText}>
          <h2 className={styles.loadingTitle}>
            {showProgress ? loadingMessages[currentMessageIndex] : message}
          </h2>

          {showProgress && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{Math.round(currentProgress)}%</span>
            </div>
          )}
        </div>

        <div className={styles.loadingFooter}>
          <div className={styles.loadingBrand}>
            <span className={styles.brandIcon}>🌈</span>
            <span className={styles.brandText}>Rainbow</span>
          </div>
        </div>
      </div>

      <div className={styles.loadingBackground}>
        <div className={styles.backgroundShape}></div>
        <div className={styles.backgroundShape} style={{ animationDelay: "1s" }}></div>
        <div className={styles.backgroundShape} style={{ animationDelay: "2s" }}></div>
      </div>
    </div>
  );
};
