import { Check } from "lucide-react";

interface CategoryFormProps {
  formData: {
    name: string;
    description: string;
  };
  isSubmitting?: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm = ({
  formData,
  isSubmitting = false,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          placeholder="Category name"
          className="input-field"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          placeholder="Category description"
          className="input-field"
          rows={3}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          <Check size={20} className="inline mr-2" />
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
