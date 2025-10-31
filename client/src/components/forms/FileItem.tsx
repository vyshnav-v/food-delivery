import React, { type ReactNode } from "react";
import { VscFile, VscFilePdf, VscFileZip } from "react-icons/vsc";

const BYTE = 1000;
const getKB = (bytes: number) => Math.round(bytes / BYTE);

interface FileIconProps {
  children: ReactNode;
}

const FileIcon: React.FC<FileIconProps> = ({ children }) => {
  return <span className="text-4xl">{children}</span>;
};

interface FileItemProps {
  file: File & { url?: string; mime_type?: string };
  children?: ReactNode;
  limit: number;
}

const FileItem: React.FC<FileItemProps> = ({ file, children }) => {
  const { type, name, size, url } = file;

  const renderThumbnail = () => {
    const isImageFile =
      type?.split("/")[0] === "image" ||
      file.mime_type?.split("/")[0] === "image" ||
      url?.startsWith("http");

    if (isImageFile) {
      const imageUrl = url || URL.createObjectURL(file);
      return (
        <img
          className="w-full h-full object-cover rounded-lg"
          src={imageUrl}
          alt="file preview"
        />
      );
    }

    if (type === "application/zip") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
          <FileIcon>
            <VscFileZip className="text-gray-500" />
          </FileIcon>
        </div>
      );
    }

    if (type === "application/pdf") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-red-50 rounded-lg">
          <FileIcon>
            <VscFilePdf className="text-red-500" />
          </FileIcon>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
        <FileIcon>
          <VscFile className="text-gray-500" />
        </FileIcon>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mt-3">
      <div className="shrink-0 w-24 h-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {renderThumbnail()}
      </div>
      <div className="flex-1 min-w-0">
        <h6 className="text-sm font-medium text-gray-900 truncate mb-1">
          {name}
        </h6>
        {size && (
          <span className="text-xs text-gray-500">{getKB(size)} KB</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};

FileItem.displayName = "FileItem";

export default FileItem;
