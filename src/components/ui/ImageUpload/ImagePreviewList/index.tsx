import { useState } from "react";
import { MdDelete, MdImage, MdVisibility } from "react-icons/md";
import { ModalImage } from "../ModalImage";
import styles from "./styles.module.scss";

type ImagePreview = {
  url: string;
  id: number;
  thumbnailUrl?: string;
};

interface ImageUploadProps {
  previews: ImagePreview[];
  onRemove: (id: number) => void;
}

export const ImagePreviewList = ({ previews, onRemove }: ImageUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePreview | null>(null);

  return (
    <>
      <div className={styles.previewContainer}>
        <h4 className={styles.previewTitle}>
          <MdImage /> Imagens ({previews.length})
        </h4>
        <div className={styles.previewGrid}>
          {previews.map((preview) => (
            <div
              key={preview.id}
              className={styles.previewItem}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
                setSelectedImage(preview);
              }}
            >
              <div className={styles.previewImageContainer}>
                <MdVisibility />
              </div>

              <img
                src={preview.thumbnailUrl || preview.url}
                alt={`Preview ${preview.id}`}
                className={styles.previewImage}
              />
              <button
                type="button"
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(preview.id);
                }}
              >
                <MdDelete />
              </button>
            </div>
          ))}

          {isModalOpen && selectedImage && (
            <ModalImage
              images={[selectedImage]}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};
