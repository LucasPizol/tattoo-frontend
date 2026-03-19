import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type ImageSource =
  | {
      src: string;
      thumbnailUrl?: string;
    }
  | {
      src?: never;
      thumbnailUrl: string;
    };

type ImageProps = {
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  thumbOnly?: boolean;
} & ImageSource;

export const Image = ({
  src,
  alt,
  className,
  loading = "lazy",
  style,
  thumbnailUrl,
  imageClassName,
  onClick,
  thumbOnly = false,
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const imageSrc = thumbOnly ? thumbnailUrl || src : src || thumbnailUrl || "";

  useEffect(() => {
    setIsLoading(true);
  }, [src, thumbnailUrl]);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setIsLoading(false);
    }
  }, [imageSrc]);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => setIsLoading(false);

  return (
    <div
      className={cn(styles.imageContainer, className, {
        [styles.loading]: isLoading && !!thumbnailUrl,
      })}
      style={{
        backgroundImage:
          thumbnailUrl && isLoading ? `url(${thumbnailUrl})` : undefined,
      }}
      onClick={onClick}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={cn(imageClassName, {
          [styles.imageLoaded]: !isLoading,
        })}
        loading={loading}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
