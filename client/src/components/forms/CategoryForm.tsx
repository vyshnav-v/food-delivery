import React from "react";
import { useForm } from "react-hook-form";

import { CommonForm } from "./CommonForm";
import type { Field } from "../../types/form";

interface CategoryFormProps {
  formData: {
    name: string;
    description: string;
  };
  isEditing?: boolean;
  isSubmitting?: boolean;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent, formData: any) => void;
  onCancel: () => void;
}

const CategoryForm = ({
  formData,
  isEditing = false,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  const form = useForm({
    defaultValues: { ...formData },
    values: { ...formData },
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      onChange(name, (value as any)[name]);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  React.useEffect(() => {
    form.reset({ ...formData });
  }, [formData, form]);

  const fields: Field[] = React.useMemo(
    () => [
      {
        name: "name",
        label: "Category Name",
        type: "text",
        placeholder: "e.g., Pizza, Burgers, Salads",
        validate: {
          required: "Category name is required",
          maxLength: {
            value: 50,
            message: "Category name cannot exceed 50 characters",
          },
        },
        isVertical: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Describe this category...",
        validate: {
          maxLength: {
            value: 200,
            message: "Description cannot exceed 200 characters",
          },
        },
        isVertical: true,
      },
    ],
    []
  );

  const handleFinish = async (data: any) => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    await onSubmit(syntheticEvent, data);
  };

  return (
    <CommonForm
      fields={fields}
      form={form}
      submitButtonLabel={isEditing ? "Update Category" : "Create Category"}
      onFinish={handleFinish}
      isLoading={isSubmitting}
      footerActions={
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary px-6 py-2.5"
        >
          Cancel
        </button>
      }
    />
  );
};

export default CategoryForm;
