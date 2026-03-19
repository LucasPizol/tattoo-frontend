import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./styles.module.scss";
import { Button } from "@/components/ui/Button";

type DrawableSignatureProps = {
  onChange: (dataUrl: string | null) => void;
};

function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height).data;

  let top = height,
    bottom = 0,
    left = width,
    right = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  const trimmed = document.createElement("canvas");
  const trimmedWidth = right - left + 1;
  const trimmedHeight = bottom - top + 1;

  if (trimmedWidth <= 0 || trimmedHeight <= 0) return canvas;

  trimmed.width = trimmedWidth;
  trimmed.height = trimmedHeight;
  trimmed
    .getContext("2d")!
    .drawImage(
      canvas,
      left,
      top,
      trimmedWidth,
      trimmedHeight,
      0,
      0,
      trimmedWidth,
      trimmedHeight,
    );

  return trimmed;
}

export const DrawableSignature = ({ onChange }: DrawableSignatureProps) => {
  const canvasRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleEnd = () => {
    if (!canvasRef.current) return;
    setIsEmpty(canvasRef.current.isEmpty());
    const canvas = canvasRef.current.getCanvas();
    onChange(trimCanvas(canvas).toDataURL("image/png"));
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setIsEmpty(true);
    onChange(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <SignatureCanvas
          ref={canvasRef}
          penColor="#1a1a2e"
          canvasProps={{ className: styles.canvas }}
          onEnd={handleEnd}
        />
        {isEmpty && <span className={styles.placeholder}>Assine aqui</span>}
      </div>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="tertiary"
          size="small"
          onClick={handleClear}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
};
