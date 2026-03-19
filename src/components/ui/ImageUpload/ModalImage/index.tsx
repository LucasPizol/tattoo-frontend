import { Image } from "@/components/ui/Image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import styles from "./styles.module.scss";

interface ImageUploadProps {
  images: {
    url: string;
    id: number;
    thumbnailUrl?: string;
  }[];
  onClose: () => void;
}

export const ModalImage = ({ images, onClose }: ImageUploadProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const currentImage = useMemo(() => {
    return images[currentImageIndex];
  }, [images, currentImageIndex]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, images.length]);

  return createPortal(
    <>
      <div className={styles.modalImageOverlay} onClick={onClose}>
        <div className={styles.modalImageWrapper}>
          <div
            className={styles.modalImageContainer}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Image
              src={currentImage?.url || currentImage?.thumbnailUrl || ""}
              alt={`Preview ${currentImage.id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              thumbnailUrl={currentImage?.thumbnailUrl}
            />

            {images.length > 1 && (
              <>
                <button
                  className={styles.navigationButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  aria-label="Imagem anterior"
                  style={{ left: "16px" }}
                >
                  <MdChevronLeft size={32} />
                </button>
                <button
                  className={styles.navigationButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Próxima imagem"
                  style={{ right: "16px" }}
                >
                  <MdChevronRight size={32} />
                </button>
              </>
            )}

            <MdClose
              size={32}
              className={styles.modalImageClose}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />

            {images.length > 1 && (
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
          <div
            className={styles.modalImageNavigation}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {images.map((image, index) => (
              <img
                key={image.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                src={image.thumbnailUrl || image.url}
                alt={`Preview ${image.id}`}
                className={currentImageIndex === index ? styles.active : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </>,
    document.querySelector("#modal-root") as HTMLElement
  );
};
