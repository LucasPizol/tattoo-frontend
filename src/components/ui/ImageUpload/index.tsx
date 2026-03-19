import { cn } from "@/utils/cn";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MdCameraAlt,
  MdCloudUpload,
  MdDelete,
  MdImage,
  MdPhotoLibrary,
} from "react-icons/md";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { useModal } from "../Modal/useModal";
import styles from "./styles.module.scss";

type ValidationResult = true | string;

interface ImageUploadProps {
  label?: string;
  onChange?: (files: File[], hasRemoved?: boolean) => Promise<void> | void;
  validateFile?: (file: File) => ValidationResult | Promise<ValidationResult>;
  accept?: string;
  maxFiles?: number;
  className?: string;
  error?: string;
  disabled?: boolean;
  initialImages?: File[];
  showPreviewList?: boolean;
  acceptCapture?: boolean;
  compressable?: boolean;
  multiple?: boolean;
  imagesData?: {
    id: number;
    url: string;
  }[];
  onRemoveImageWithId?: (id: number) => void;
}

const MAX_SIZE_MB = 1;

export const ImageUpload = ({
  multiple = true,
  label = "Upload de Imagens",
  onChange,
  validateFile,
  accept = "image/*",
  maxFiles = 10,
  className,
  error,
  disabled = false,
  initialImages = [],
  showPreviewList = true,
  acceptCapture = false,
  compressable = false,
  imagesData: imagesDataProp = [],
  onRemoveImageWithId,
}: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    initialImages.map((image) => URL.createObjectURL(image))
  );
  const [imagesData, setImagesData] = useState<
    {
      id: number;
      url: string;
    }[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { open, close, modalProps } = useModal();

  useEffect(() => {
    if (initialImages.length > 0) {
      setFiles(initialImages);
    }
  }, [initialImages]);

  useEffect(() => {
    if (imagesDataProp.length > 0) {
      setImagesData(imagesDataProp);
    }
  }, [imagesDataProp]);

  const compressImage = useCallback(
    (file: File, maxSizeMB: number = MAX_SIZE_MB): Promise<File> => {
      return new Promise((resolve) => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024; // Converter MB para bytes

        // Se o arquivo já está abaixo do limite ou compressão não está habilitada, retorna sem comprimir
        if (file.size <= maxSizeBytes || !compressable) {
          resolve(file);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const originalWidth = img.width;
            const originalHeight = img.height;

            // Estratégia: primeiro redimensionar, depois comprimir
            // Calcular dimensões iniciais baseadas no tamanho do arquivo
            const initialMaxDimension = 1920; // Começar com dimensão maior

            // Função para redimensionar a imagem
            const resizeImage = (
              maxDim: number
            ): { width: number; height: number } => {
              let width = originalWidth;
              let height = originalHeight;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = (height / width) * maxDim;
                  width = maxDim;
                } else {
                  width = (width / height) * maxDim;
                  height = maxDim;
                }
              }
              canvas.width = width;
              canvas.height = height;

              return { width, height };
            };

            // Função para tentar comprimir com diferentes qualidades
            const tryCompress = (quality: number, maxDim: number): void => {
              // Redimensionar com a dimensão atual
              const { width, height } = resizeImage(maxDim);

              const ctx = canvas.getContext("2d");
              if (!ctx) {
                resolve(file);
                return;
              }

              // Melhorar a qualidade do canvas
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";

              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    resolve(file);
                    return;
                  }

                  // Se já está no tamanho desejado, usar essa versão
                  if (blob.size <= maxSizeBytes) {
                    const compressedFile = new File([blob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  } else if (quality > 0.7) {
                    // Se ainda está grande mas qualidade é boa, reduzir qualidade em passos menores
                    tryCompress(quality - 0.05, maxDim);
                  } else if (maxDim > 1280) {
                    // Se qualidade já está baixa, reduzir dimensão
                    tryCompress(0.85, maxDim - 160);
                  } else if (quality > 0.6) {
                    // Última tentativa com qualidade um pouco menor
                    tryCompress(quality - 0.05, maxDim);
                  } else {
                    // Usar a versão atual mesmo que esteja um pouco acima do limite
                    const compressedFile = new File([blob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  }
                },
                file.type === "image/png" ? "image/jpeg" : file.type, // Converter PNG para JPEG para melhor compressão
                quality
              );
            };

            // Começar com qualidade alta (0.95) e dimensão grande
            tryCompress(0.93, initialMaxDimension);
          };
          img.onerror = () => resolve(file);
          img.src = e.target?.result as string;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
      });
    },
    [compressable]
  );

  const handleFileChange = useCallback(
    async (selectedFiles: File[]) => {
      setIsLoading(true);
      setValidationErrors([]);
      const newFiles = Array.from(selectedFiles);

      // Limitar número de arquivos
      const totalFiles = files.length + newFiles.length;
      if (totalFiles > maxFiles) {
        alert(`Máximo de ${maxFiles} imagens permitidas`);
        setIsLoading(false);
        return;
      }

      // Validar tipo de arquivo
      const validTypeFiles = newFiles.filter((file) =>
        accept.includes(file.type.split("/")[0])
      );
      if (validTypeFiles.length !== newFiles.length) {
        alert("Apenas arquivos de imagem são permitidos");
      }

      if (validTypeFiles.length === 0) {
        setIsLoading(false);
        return;
      }

      // Validar arquivos com a função customizada
      const errors: string[] = [];
      const validFiles: File[] = [];

      if (validateFile) {
        for (const file of validTypeFiles) {
          const result = await Promise.resolve(validateFile(file));
          if (result === true) {
            validFiles.push(file);
          } else {
            errors.push(`${file.name}: ${result}`);
          }
        }
      } else {
        validFiles.push(...validTypeFiles);
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
      }

      if (validFiles.length === 0) {
        setIsLoading(false);
        return;
      }

      // Comprimir imagens maiores que 2MB
      const compressedFiles = await Promise.all(
        validFiles.map((file) => compressImage(file, 2))
      );

      // Criar previews
      const newPreviews: string[] = [];
      compressedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          newPreviews.push(e.target?.result as string);
          if (newPreviews.length === compressedFiles.length) {
            setFiles((prev) =>
              multiple ? [...prev, ...compressedFiles] : [compressedFiles[0]]
            );

            setPreviews((prev) =>
              multiple ? [...prev, ...newPreviews] : [newPreviews[0]]
            );
            await onChange?.(
              multiple ? [...files, ...compressedFiles] : [compressedFiles[0]]
            );
            open();
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [files, maxFiles, onChange, compressImage, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFileChange(droppedFiles);
    },
    [disabled, handleFileChange]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (!disabled) {
      if (acceptCapture) {
        open();
      } else {
        fileInputRef.current?.click();
      }
    }
  };

  const handleCameraClick = () => {
    close();
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    close();
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onChange?.(newFiles, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileChange(Array.from(e.target.files));
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      e.target.value = "";
    }
  };

  const previewImages = useMemo((): {
    url: string;
    id?: number;
  }[] => {
    return [...imagesData, ...previews.map((preview) => ({ url: preview }))];
  }, [imagesData, previews]);

  return (
    <div className={cn(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={cn(
          styles.uploadArea,
          isDragOver && styles.dragOver,
          disabled && styles.disabled,
          error && styles.error
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className={styles.hiddenInput}
          disabled={disabled}
        />
        {acceptCapture && (
          <input
            ref={cameraInputRef}
            type="file"
            accept={accept}
            capture="environment"
            multiple={multiple}
            onChange={handleInputChange}
            className={styles.hiddenInput}
            disabled={disabled}
          />
        )}

        <div className={styles.uploadContent}>
          <MdCloudUpload className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            Arraste e solte imagens aqui ou{" "}
            <span className={styles.clickText}>clique para selecionar</span>
          </p>
          <p className={styles.uploadSubtext}>
            Máximo {maxFiles} imagens • PNG, JPG, GIF até 10MB
          </p>
        </div>
      </div>

      {error && <span className={styles.errorText}>{error}</span>}

      {validationErrors.length > 0 && (
        <div className={styles.validationErrors}>
          {validationErrors.map((err, index) => (
            <span key={index} className={styles.errorText}>
              {err}
            </span>
          ))}
        </div>
      )}

      {showPreviewList && previewImages.length > 0 && (
        <div className={styles.previewContainer}>
          <h4 className={styles.previewTitle}>
            <MdImage /> Imagens ({previewImages.length})
          </h4>
          <div className={styles.previewGrid}>
            {previewImages.map((preview, index) => (
              <div key={index} className={styles.previewItem}>
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveImageWithId && preview.id) {
                      onRemoveImageWithId(preview.id);
                      setImagesData(
                        imagesData.filter((image) => image.id !== preview.id)
                      );
                    } else {
                      removeImage(index);
                    }
                  }}
                  disabled={disabled}
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptCapture && (
        <Modal {...modalProps} title="Escolha uma opção">
          <div className={styles.captureOptions}>
            <Button
              variant="primary"
              prefixIcon={<MdCameraAlt size={20} />}
              onClick={handleCameraClick}
              className={styles.captureOption}
              loading={isLoading}
            >
              Abrir Câmera
            </Button>
            <Button
              variant="secondary"
              prefixIcon={<MdPhotoLibrary size={20} />}
              onClick={handleUploadClick}
              className={styles.captureOption}
              loading={isLoading}
            >
              Escolher da Galeria
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
