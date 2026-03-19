import { cn } from "@/utils/cn";
import { useMemo, useState } from "react";
import {
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import styles from "./styles.module.scss";

type PreviewProps = {
  contents: {
    url: string;
    id: number;
    thumbnailUrl?: string;
  }[];
  caption: string;
  account?: {
    username: string;
    profilePictureUrl: string;
  };
};

export const Preview = ({ contents, caption, account }: PreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const imageUrls = useMemo(() => {
    return contents.map((content) => content.url);
  }, [contents]);

  const hasMultipleImages = contents.length > 1;
  const hasContent = contents.length > 0;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < contents.length - 1 ? prev + 1 : prev));
  };

  const formatCaption = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <p key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </p>
    ));
  };

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.instagramPost}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <div className={styles.avatarWrapper}>
              {account?.profilePictureUrl ? (
                <img
                  src={account.profilePictureUrl}
                  alt={account.username}
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder} />
              )}
            </div>
            <div className={styles.usernameContainer}>
              {account?.username ? (
                <span className={styles.username}>{account.username}</span>
              ) : (
                <span className={styles.captionEmpty}>Nome do usuário</span>
              )}
            </div>
          </div>
          <button className={styles.menuButton}>
            <HiDotsHorizontal size={20} />
          </button>
        </div>

        {/* Media Container */}
        <div className={styles.mediaContainer}>
          {hasContent ? (
            <>
              <div className={styles.mediaWrapper}>
                <img
                  src={imageUrls[currentIndex]}
                  alt={`Post ${currentIndex + 1}`}
                  className={styles.media}
                />
              </div>

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  {currentIndex > 0 && (
                    <button
                      className={cn(styles.navButton, styles.navPrev)}
                      onClick={handlePrev}
                    >
                      <FaChevronLeft size={14} />
                    </button>
                  )}
                  {currentIndex < contents.length - 1 && (
                    <button
                      className={cn(styles.navButton, styles.navNext)}
                      onClick={handleNext}
                    >
                      <FaChevronRight size={14} />
                    </button>
                  )}
                </>
              )}

              {/* Dots Indicator */}
              {hasMultipleImages && (
                <div className={styles.dotsContainer}>
                  {contents.map((_, index) => (
                    <div
                      key={index}
                      className={cn(styles.dot, {
                        [styles.active]: index === currentIndex,
                      })}
                    />
                  ))}
                </div>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className={styles.imageCounter}>
                  {currentIndex + 1}/{contents.length}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyMedia}>
              <span>Adicione imagens ao post</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.leftActions}>
            <button
              className={cn(styles.actionButton, { [styles.liked]: isLiked })}
              onClick={() => setIsLiked(!isLiked)}
            >
              {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
            <button className={styles.actionButton}>
              <FaRegComment size={24} />
            </button>
            <button className={styles.actionButton}>
              <FaPaperPlane size={22} />
            </button>
          </div>

          {/* Dots for multiple images (centered) */}
          {hasMultipleImages && (
            <div className={styles.actionsDots}>
              {contents.map((_, index) => (
                <div
                  key={index}
                  className={cn(styles.actionDot, {
                    [styles.active]: index === currentIndex,
                  })}
                />
              ))}
            </div>
          )}

          <button
            className={cn(styles.actionButton, styles.saveButton, {
              [styles.saved]: isSaved,
            })}
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
          </button>
        </div>

        {/* Likes */}
        <div className={styles.likes}>
          <span className={styles.likesCount}>0 curtidas</span>
        </div>

        {/* Caption */}
        <div className={styles.captionContainer}>
          {caption ? (
            <p className={styles.caption}>
              {account?.username ? (
                <p className={styles.captionUsername}>{account.username}</p>
              ) : (
                <p className={styles.captionEmpty}>Nome do usuário</p>
              )}
              {formatCaption(caption)}
            </p>
          ) : (
            <p className={styles.captionEmpty}>A legenda aparecerá aqui...</p>
          )}
        </div>

        {/* Timestamp */}
        <div className={styles.timestamp}>
          <span>AGORA</span>
        </div>
      </div>
    </div>
  );
};
