import { Image } from "@/components/ui/Image";
import { cn } from "@/utils/cn";
import { useMemo, useState } from "react";
import { MdDelete, MdImage } from "react-icons/md";
import { ModalImage } from "../ModalImage";
import styles from "./styles.module.scss";

type RemovableOptions =
  | {
      removable?: true;
      onRemove: () => void;
    }
  | {
      removable?: false;
    };

type ImageUploadProps = {
  images: {
    url: string;
    id: number;
    thumbnailUrl?: string;
  }[];
  className?: string;
  clickable?: boolean;
  rounded?: boolean;
  size?: "small" | "medium" | "large";
  maxHeight?: string;
  maxWidth?: string;
} & RemovableOptions;

export const ImagePreview = ({
  images,
  clickable = false,
  removable = false,
  rounded = false,
  size = "medium",
  className,
  maxHeight,
  maxWidth,
  ...props
}: ImageUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderImages = useMemo(() => {
    if (images.length === 0) {
      return (
        <div
          className={styles.previewImagePlaceholder}
          style={{
            maxHeight,
            maxWidth,
          }}
        >
          <MdImage
            style={{
              maxHeight,
              maxWidth,
            }}
          />
        </div>
      );
    }

    const firstImage = images[0];

    return (
      <div
        className={styles.previewImageContainer}
        style={{
          maxHeight,
          maxWidth,
        }}
      >
        <Image
          src={firstImage.url}
          thumbnailUrl={firstImage.thumbnailUrl || ""}
          alt={`Preview`}
          imageClassName={styles.previewImage}
          className={styles.imageWrapper}
          loading="lazy"
          thumbOnly
          onClick={(e) => {
            if (clickable) {
              e.stopPropagation();
              setIsModalOpen(true);
            }
          }}
          style={{
            maxHeight,
            maxWidth,
          }}
        />
        {images.length > 1 && (
          <div className={styles.previewImageQuantity}>
            <span>+{images.length - 1}</span>
          </div>
        )}
      </div>
    );
  }, [images]);

  return (
    <>
      <div
        className={cn(styles.previewItem, className, {
          [styles.rounded]: rounded,
          [styles.clickable]: clickable,
          [styles.small]: size === "small",
          [styles.medium]: size === "medium",
          [styles.large]: size === "large",
        })}
        style={{
          maxHeight,
          maxWidth,
        }}
      >
        {renderImages}

        {removable && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={(e) => {
              if (removable && "onRemove" in props) {
                e.stopPropagation();
                props.onRemove();
              }
            }}
          >
            <MdDelete />
          </button>
        )}
      </div>

      {isModalOpen && clickable && (
        <ModalImage images={images} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
