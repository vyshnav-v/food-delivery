import { useForm } from "react-hook-form";
import { CommonForm } from "./CommonForm";
import type { Field, FileType } from "../../types/form";
import type { Category } from "../../types";
import React from "react";

interface ProductFormProps {
  formData: {
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    status: string;
    featured: string;
    imageUrl?: string;
    image?: FileType[];
  };
  categories: Category[];
  isEditing?: boolean;
  isSubmitting?: boolean;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent, formData: any) => void;
  onCancel: () => void;
}

const ProductForm = ({
  formData,
  categories,
  isEditing = false,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const form = useForm({
    defaultValues: {
      ...formData,
      image: formData?.image
        ? Array.isArray(formData.image)
          ? formData.image
          : [formData.image]
        : [],
    },
    values: {
      ...formData,
      image: formData?.image
        ? Array.isArray(formData.image)
          ? formData.image
          : [formData.image]
        : [],
    },
  });

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name) return;
      onChange(name, (value as any)[name]);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  React.useEffect(() => {
    form.reset({
      ...formData,
      image: formData?.image
        ? Array.isArray(formData.image)
          ? formData.image
          : [formData.image]
        : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const fields: Field[] = [
    {
      name: "image",
      label: "Product Image",
      type: "upload",
      Filetype: "image",
      limit: 5242880, // 5MB
      multiple: false,
      subLabel:
        "Upload product image (JPG, PNG, max 5MB). Images are converted to WebP.",
      enableCrop: true,
      cropAspect: 1,
      showPreview: true,
    },
    {
      name: "imageUrl",
      label: "Or Enter Image URL",
      type: "text",
      placeholder: "https://example.com/image.jpg or /uploads/image.jpg",
      subLabel: "Alternative: Paste an image URL instead of uploading",
      isVertical: true,
    },
    {
      name: "name",
      label: "Product Name",
      type: "text",
      placeholder: "Enter product name",
      validate: {
        required: "Product name is required",
        minLength: { value: 3, message: "Minimum 3 characters required" },
      },
      isVertical: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your product...",
      validate: {
        required: "Description is required",
        minLength: { value: 10, message: "Minimum 10 characters required" },
      },
      isVertical: true,
    },
    {
      name: "price",
      label: "Price ($)",
      type: "text",
      placeholder: "0.00",
      inputMode: "decimal",
      validate: {
        required: "Price is required",
        pattern: {
          value: /^(?:\d+)(?:\.\d{0,2})?$/,
          message: "Enter a valid price (up to 2 decimals)",
        },
      },
      isVertical: true,
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      placeholder: "0",
      validate: {
        required: "Stock quantity is required",
        min: { value: 0, message: "Stock must be non-negative" },
      },
      isVertical: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "Select a category",
      options: categoryOptions,
      validate: {
        required: "Category is required",
      },
      isVertical: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Available", value: "available" },
        { label: "Unavailable", value: "unavailable" },
        { label: "Out of Stock", value: "out-of-stock" },
      ],
      validate: {
        required: "Status is required",
      },
      isVertical: true,
    },
    {
      name: "featured",
      label: "Featured Product",
      type: "select",
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
      subLabel: "Featured products will be highlighted on the products page",
      isVertical: true,
    },
  ];

  const handleFormSubmit = async (data: any) => {
    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    onSubmit(syntheticEvent, data);
  };
  return (
    <div className="space-y-6">
      <CommonForm
        fields={fields}
        form={form}
        submitButtonLabel={isEditing ? "Update Product" : "Create Product"}
        onFinish={handleFormSubmit}
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
    </div>
  );
};

export default ProductForm;
