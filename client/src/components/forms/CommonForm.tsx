import { type FC, lazy, Suspense } from "react";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

import type { CommonFormProps, Field } from "../../types/form";

import Files from "./File";
import Form from "./Form";
import FormInput from "./FormInput";
import FormRow from "./FormRow";
import Select from "./Select";

// Lazy load React Quill for rich text editor
const ReactQuill = lazy(() => import("react-quill"));

// Loading component for React Quill
const QuillLoader = () => (
  <p className="text-sm text-gray-500">Loading editor...</p>
);

export const CommonForm: FC<CommonFormProps> = ({
  fields,
  form,
  children,
  submitButtonLabel = "Submit",
  formatData,
  onFinish,
  isLoading,
  footerActions,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: any) => {
    try {
      const data = formatData ? formatData(values) : values;
      const formData = new FormData();
      let hasFiles = false;

      const uploadFields = fields
        .filter((field) => field.type === "upload")
        .map((field) => field.name);

      Object.keys(data).forEach((key) => {
        if (uploadFields.includes(key)) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            data[key].forEach((file: any) => {
              if (file?.file) {
                formData.append(key, file.file);
                hasFiles = true;
              }
            });
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      if (hasFiles) {
        await onFinish(data);
      } else {
        await onFinish(data);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting form");
      throw error;
    }
  };

  const renderField = (field: Field) => {
    const {
      name,
      label,
      type,
      options,
      validate,
      placeholder,
      addChildren,
      limit,
      quillModules,
      showPreview,
      subLabel: _subLabel,
      isVertical: _isVertical,
      ...fieldProps
    } = field;

    void _subLabel;
    void _isVertical;

    switch (type) {
      case "select":
        return (
          <Controller
            name={name}
            control={control}
            rules={validate}
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => (
              <Select
                inputRef={ref}
                value={
                  options?.find((option) => option.value === value) || null
                }
                onChange={(selectedOption: any) =>
                  onChange(selectedOption?.value)
                }
                options={options || []}
                placeholder={placeholder || `Select ${label.toLowerCase()}...`}
                className="w-full"
                invalid={!!error}
                errorMessage={error?.message}
                {...fieldProps}
              />
            )}
          />
        );
      case "radio":
        return (
          <FormInput
            name={name}
            type="radio"
            values={options || []}
            form={form}
            {...fieldProps}
          />
        );
      case "upload":
        return (
          <Controller
            name={name}
            control={control}
            rules={validate}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Files
                form={form}
                fieldName={name}
                label={label}
                limit={limit}
                uploadedFile={value || []}
                setUploadedFile={(files: any) => onChange(files)}
                error={error?.message}
                showPreview={showPreview}
                subLabel={_subLabel}
                {...fieldProps}
              />
            )}
          />
        );
      case "addChildren":
        return addChildren;
      case "textEditor":
        return (
          <Controller
            name={name}
            control={control}
            rules={validate}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <div className="w-full">
                <div className={`quill-container ${error ? "error" : ""}`}>
                  <Suspense fallback={<QuillLoader />}>
                    <ReactQuill
                      theme="snow"
                      value={value || ""}
                      onChange={onChange}
                      modules={quillModules}
                      placeholder={
                        placeholder || `Enter ${label.toLowerCase()}...`
                      }
                      {...fieldProps}
                    />
                  </Suspense>
                </div>
                {error && (
                  <span className="text-sm text-red-500">{error.message}</span>
                )}
              </div>
            )}
          />
        );
      case "textarea": {
        return (
          <FormInput
            {...register(name, { ...validate })}
            name={name}
            type={type}
            textArea={true}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            invalid={!!errors[name]}
            errorMessage={errors[name]?.message as string}
            form={form}
            {...fieldProps}
          />
        );
      }
      default: {
        return (
          <FormInput
            {...register(name, { ...validate })}
            name={name}
            type={type}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            invalid={!!errors[name]}
            errorMessage={errors[name]?.message as string}
            form={form}
            {...fieldProps}
          />
        );
      }
    }
  };

  return (
    <div className="relative bg-white">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {fields.map((field) =>
            field.type === "upload" ? (
              <div key={field.name}>{renderField(field)}</div>
            ) : (
              <FormRow
                key={field.name}
                label={field.label}
                subLabel={field.subLabel}
                isVertical={field.isVertical}
                hasBorder={false}
              >
                {renderField(field)}
              </FormRow>
            )
          )}
        </div>
        {children}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          {footerActions}
          <button
            type="submit"
            className="btn-primary px-6 py-2.5 flex items-center justify-center gap-2 min-w-[120px]"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              submitButtonLabel
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};
