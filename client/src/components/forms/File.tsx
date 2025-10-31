import { Cloud } from "lucide-react";
import React, { useEffect } from "react";

import type { FilesProps, FileType } from "../../types/form";

import FileUpload from "./FileUpload";

const Files: React.FC<FilesProps> = ({
  uploadedFile,
  setUploadedFile,
  form,
  fieldName,
  label,
  Filetype,
  limit,
  subLabel,
  isFullWidth,
  error,
  maxWidth,
  maxHeight,
  multiple,
  enableCrop,
  cropAspect,
  showPreview,
  accept,
}) => {
  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        resolve(true);
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (
          maxWidth &&
          maxHeight &&
          (img.width !== maxWidth || img.height !== maxHeight)
        ) {
          reject(
            `Invalid dimensions. Expected ${maxWidth}x${maxHeight}, got ${img.width}x${img.height}.`
          );
          return;
        }
        resolve(true);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject("Failed to load image");
      };
    });
  };

  const onFileUpload = async (files: File[]) => {
    try {
      form.clearErrors(fieldName);
      const fileArray = Array.from(files);
      const newFiles: FileType[] = await Promise.all(
        fileArray.map(async (file) => {
          await validateImageDimensions(file);
          return {
            file,
            fileId: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file), // ✅ Create URL
            type: file.type,
          };
        })
      );

      setUploadedFile(newFiles);
      form.setValue(fieldName, newFiles);
      await form.trigger(fieldName);
    } catch (error: any) {
      form.setError(fieldName, {
        message: error.message || "Error uploading file",
      });
    }
  };

  const handleFileRemove = async (files: any[]) => {
    const normalized = files as FileType[];
    setUploadedFile(normalized);
    form.setValue(fieldName, normalized);
    await form.trigger(fieldName);
  };

  // // ✅ Cleanup URLs when file list changes
  useEffect(() => {
    return () => {
      uploadedFile.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [uploadedFile]);

  const beforeUpload = async (newFiles: File[]): Promise<boolean> => {
    try {
      for (const file of newFiles) {
        if (Filetype === "image" && !file.type.startsWith("image/")) {
          throw new Error("Only image files (JPG, PNG, etc.) are allowed.");
        }
        if (limit && file.size > limit) {
          throw new Error(
            `File must not exceed ${Math.ceil(limit / 1024)} KB.`
          );
        }
        await validateImageDimensions(file);
      }
      return true;
    } catch (error: any) {
      form.setError(fieldName, {
        message: error.message || "Validation failed",
      });
      return false;
    }
  };

  return (
    <div
      className={`${isFullWidth ? "my-1 w-full flex-row gap-4 py-1" : "relative mb-6 flex flex-col gap-5 sm:flex-row"}`}
    >
      <div className="basis-1/3">
        <h5 className="text-sm font-medium text-gray-900">{label}</h5>
        {subLabel && <p className="text-xs text-gray-600 mt-0.5">{subLabel}</p>}
      </div>
      <div className="flex basis-2/3 flex-col">
        <FileUpload
          draggable
          beforeUpload={beforeUpload}
          className="size-full cursor-pointer border-none"
          onChange={onFileUpload}
          onFileRemove={handleFileRemove}
          limit={limit}
          multiple={multiple}
          fileList={uploadedFile}
          enableCrop={enableCrop}
          cropAspect={cropAspect}
          accept={accept || (Filetype === "image" ? "image/*" : undefined)}
          showPreview={showPreview}
        >
          <div
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl py-10 px-4 border-2 border-dashed transition-all duration-200 ${
              error
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-gray-300 bg-linear-to-br from-gray-50 to-white hover:border-primary-400 hover:from-primary-50 hover:to-white"
            }`}
          >
            <div
              className={`flex size-14 items-center justify-center rounded-full shadow-sm ${error ? "bg-red-100" : "bg-primary-100"}`}
            >
              <Cloud
                className={error ? "text-red-600" : "text-primary-600"}
                size={28}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1 items-center">
                <p className="text-sm font-semibold text-gray-900">
                  Click to upload
                </p>
                <p className="text-sm text-gray-600">or drag and drop</p>
              </div>
              <p className="text-center text-xs text-gray-500 mt-1">
                {Filetype === "image"
                  ? `PNG, JPG, GIF ${limit ? `(max. ${Math.ceil(limit / (1024 * 1024))} MB)` : ""} ${maxWidth && maxHeight ? `, ${maxWidth}x${maxHeight}px` : ""}. Converted to WebP on save.`
                  : "PDF files accepted"}
              </p>
            </div>
          </div>
        </FileUpload>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Files;
