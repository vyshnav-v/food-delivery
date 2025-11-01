import React from "react";
import { useForm } from "react-hook-form";

import { CommonForm } from "./CommonForm";
import type { Field } from "../../types/form";
import type { User } from "../../types";

interface UserFormProps {
  user: User | null;
  isSubmitting?: boolean;
  onSubmit: (formData: any) => Promise<void> | void;
  onCancel: () => void;
}

const UserForm = ({
  user,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const defaultValues = React.useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      role: user?.role || "customer",
    }),
    [user]
  );

  const form = useForm({
    defaultValues,
    values: defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const fields: Field[] = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter full name",
      validate: {
        required: "Full name is required",
        minLength: { value: 3, message: "Minimum 3 characters required" },
      },
      isVertical: true,
      disabled: isSubmitting,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      validate: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
      isVertical: true,
      disabled: isSubmitting,
    },
    {
      name: "mobile",
      label: "Mobile",
      type: "tel",
      placeholder: "Enter mobile number",
      validate: {
        pattern: {
          value: /^[0-9]{10,15}$/,
          message: "Please enter a valid mobile number (10-15 digits)",
        },
      },
      isVertical: true,
      disabled: isSubmitting,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Customer", value: "customer" },
        { label: "Admin", value: "admin" },
      ],
      validate: {
        required: "Role is required",
      },
      isVertical: true,
      disabled: isSubmitting,
    },
  ];

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <CommonForm
      fields={fields}
      form={form}
      submitButtonLabel={user ? "Update User" : "Create User"}
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
  );
};

export default UserForm;
