import { Trash2 } from "lucide-react";
import classNames from "classnames";
import React, {
  forwardRef,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import toast from "react-hot-toast";

import FileItem from "./FileItem";
import ImageCropModal from "./ImageCropModal";

interface FileUploadProps {
  accept?: string;
  beforeUpload?: (
    newFiles: File[],
    files: File[],
  ) => Promise<boolean | string> | boolean | string;
  disabled?: boolean;
  draggable?: boolean;
  fileList: any[];
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  onFileRemove?: (files: File[]) => void;
  showList?: boolean;
  tip?: string | React.ReactNode;
  uploadLimit?: number;
  className?: string;
  children?: React.ReactNode;
  limit?: number;
  position?: any;
  photoPosition?: any;
  field?: any;
  form?: any;
  enableCrop?: boolean;
  cropAspect?: number;
  showPreview?: boolean;
}

const filesToArray = (files: File[]) =>
  Object.keys(files).map((key) => files[parseInt(key, 10)]);

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>((props, ref) => {
  const {
    accept,
    beforeUpload,
    disabled,
    draggable = false,
    fileList = [],
    multiple = true,
    onChange,
    onFileRemove,
    showList = true,
    tip,
    uploadLimit,
    children,
    className,
    field,
    limit = 10000,
    position,
    photoPosition,
    enableCrop,
    cropAspect,
    showPreview,
    ...rest
  } = props;

  const fileInputField = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>(fileList);
  const [cropState, setCropState] = useState<{
    file: File;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!multiple && fileList.length > 1) {
      setFiles([fileList[0]]);
    } else {
      setFiles(fileList);
    }
  }, [fileList, multiple]);

  const triggerMessage = (msg: any) => {
    toast.error(msg || 'Upload Failed!');
  };

  const addNewFiles = (newFiles: File[]) => {
    let updatedFiles = [...files];

    if (!multiple) {
      updatedFiles = [newFiles[0]];
    } else {
      if (uploadLimit && updatedFiles.length >= uploadLimit) {
        if (uploadLimit === 1) {
          updatedFiles.shift();
        } else {
          updatedFiles = updatedFiles.slice(-uploadLimit + newFiles.length);
        }
      }
      updatedFiles.push(...newFiles);
    }

    return filesToArray(updatedFiles);
  };

  const onNewFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    let result = beforeUpload ? await beforeUpload(newFiles, files) : true;

    if (result === false || typeof result === 'string') {
      triggerMessage(typeof result === 'string' ? result : undefined);
      return;
    }

    if (enableCrop && newFiles.length > 0) {
      const file = newFiles[0];
      const url = URL.createObjectURL(file);
      setCropState({ file, url });
      return;
    }

    const updatedFiles = addNewFiles(newFiles);
    onChange?.(updatedFiles);

    // ✅ Reset file input
    if (fileInputField.current) {
      fileInputField.current.value = '';
    }
  };

  const removeFile = (fileIndex: number) => {
    const deletedFileList = files.filter((_, index) => index !== fileIndex);
    setFiles(deletedFileList);
    onFileRemove?.(deletedFileList);
  };

  const triggerUpload = (e: React.MouseEvent) => {
    if (!disabled) {
      fileInputField.current?.click();
    }
    e.stopPropagation();
  };

  const renderChildren = () => {
    if (!draggable && !children) {
      return (
        <button disabled={disabled} onClick={(e) => e.preventDefault()}>
          Upload
        </button>
      );
    }

    if (draggable && !children) {
      return <span>Choose a file or drag and drop here</span>;
    }

    return children;
  };

  const handleDragLeave = useCallback(() => {
    // Drag leave handler
  }, []);

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault(); // ✅ Prevent browser behavior
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (draggable && !disabled) {
        const newFiles = Array.from(event.dataTransfer.files);

        if (!multiple && newFiles.length > 1) {
          triggerMessage('Only one file is allowed at a time.');
          return;
        }

        onNewFileUpload({
          target: { files: newFiles },
        } as any);
      }
    },
    [draggable, disabled, multiple, onNewFileUpload, triggerMessage],
  );

  const draggableProp = {
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onClick: triggerUpload,
  };

  const uploadClass = classNames(
    'upload',
    draggable && 'upload-draggable',
    draggable && disabled && 'disabled',
    className,
  );

  const uploadInputClass = classNames('upload-input', draggable && 'draggable');

  return (
    <>
      <div
        ref={ref}
        className={uploadClass}
        {...(draggable ? draggableProp : { onClick: triggerUpload })}
        {...rest}
      >
        <input
          className={`${uploadInputClass} hidden`}
          type="file"
          ref={fileInputField}
          onChange={onNewFileUpload}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
          title=""
          value=""
          {...field}
          {...rest}
        />
        {renderChildren()}
      </div>
      {tip}
      {(showPreview ?? showList) && (
        <div className="mt-2">
          {files.map((file, index) => (
            <FileItem
              file={file}
              key={file.name + index}
              limit={limit}
            >
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <Trash2 size={18} />
              </button>
              {position && (
                <div className="mr-1 mt-1 flex size-10 items-center justify-center rounded-lg border border-gray-300">
                  {photoPosition + index}
                </div>
              )}
            </FileItem>
          ))}
        </div>
      )}
      <ImageCropModal
        isOpen={!!cropState}
        imageSrc={cropState?.url || ""}
        originalFileName={cropState?.file.name || "image"}
        aspect={cropAspect}
        onCancel={() => {
          if (cropState?.url) {
            URL.revokeObjectURL(cropState.url);
          }
          setCropState(null);
          if (fileInputField.current) {
            fileInputField.current.value = '';
          }
        }}
        onComplete={(file) => {
          if (cropState?.url) {
            URL.revokeObjectURL(cropState.url);
          }
          setCropState(null);
          onChange?.([file]);
          if (fileInputField.current) {
            fileInputField.current.value = '';
          }
        }}
      />
    </>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
