import type { ReactNode, InputHTMLAttributes } from "react";
import type { UseFormReturn, RegisterOptions } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  subLabel?: string;
}

export interface Field {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "select"
    | "radio"
    | "checkbox"
    | "textarea"
    | "upload"
    | "textEditor"
    | "addChildren";
  placeholder?: string;
  validate?: RegisterOptions;
  options?: SelectOption[];
  addChildren?: ReactNode;
  limit?: number;
  quillModules?: any;
  subLabel?: string;
  isVertical?: boolean;
  Filetype?: "image" | "pdf";
  maxWidth?: number;
  maxHeight?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  enableCrop?: boolean;
  cropAspect?: number;
  accept?: string;
  showPreview?: boolean;
  step?: number | string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

export interface CommonFormProps {
  fields: Field[];
  form: UseFormReturn<any>;
  children?: ReactNode;
  submitButtonLabel?: string;
  formatData?: (values: any) => any;
  onFinish: (data: any) => Promise<void>;
  isLoading?: boolean;
  footerActions?: ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  invalid?: boolean;
  errorMessage?: string;
  inputRef?: any;
  disabled?: boolean;
  className?: string;
}

export interface FileType {
  file?: File;
  fileId: string;
  name: string;
  size: number;
  url: string;
  type: string;
}

export interface FilesProps {
  uploadedFile: FileType[];
  setUploadedFile: (files: FileType[]) => void;
  form: UseFormReturn<any>;
  fieldName: string;
  label: string;
  Filetype?: "image" | "pdf";
  limit?: number;
  subLabel?: string;
  isFullWidth?: boolean;
  error?: string;
  maxWidth?: number;
  maxHeight?: number;
  multiple?: boolean;
  enableCrop?: boolean;
  cropAspect?: number;
  showPreview?: boolean;
  accept?: string;
}

export interface FormRowProps {
  label?: string;
  subLabel?: string;
  title?: boolean;
  hasBorder?: boolean;
  hasBorderSlim?: boolean;
  hasButton?: boolean;
  isVertical?: boolean;
  center?: boolean;
  direction?: boolean;
  align?: boolean;
  hasEqualRowSize?: boolean;
  hasBottomSpace?: boolean;
  hideLabel?: boolean;
  children: ReactNode;
}

export interface FormInputProps {
  type?: string;
  invalid?: boolean;
  form?: UseFormReturn<any>;
  disabled?: boolean;
  textArea?: boolean;
  name: string;
  validate?: RegisterOptions;
  style?: React.CSSProperties;
  label?: string;
  hasWrapper?: boolean;
  errorMessage?: string;
  right?: ReactNode;
  className?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values?: SelectOption[];
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
}
