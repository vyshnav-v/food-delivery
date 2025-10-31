import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "../Modal";

import "react-easy-crop/react-easy-crop.css";

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  originalFileName: string;
  aspect?: number;
  onCancel: () => void;
  onComplete: (file: File) => void;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

const getCroppedImage = (
  imageSrc: string,
  pixelCrop: CroppedAreaPixels
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to crop image"));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.9
      );
    };

    image.onerror = () => reject(new Error("Failed to load image"));
  });
};

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onCancel,
  onComplete,
  originalFileName,
  aspect = 1,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: any, croppedPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
      const baseName = originalFileName.replace(/\.[^/.]+$/, "");
      const webpFile = new File([croppedBlob], `${baseName}.webp`, {
        type: "image/webp",
      });
      onComplete(webpFile);
    } catch (error) {
      console.error("Image cropping failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, onComplete, originalFileName]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Crop Image" size="lg">
      <div className="space-y-6">
        <div className="relative w-full h-[400px] bg-gray-900 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            showGrid={false}
            minZoom={1}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary-600"
          />
          <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            disabled={isProcessing || !croppedAreaPixels}
          >
            {isProcessing ? "Processing..." : "Save & Convert"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropModal;
