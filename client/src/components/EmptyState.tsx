import React from "react";

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Reusable empty state component
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="col-span-full card text-center py-12">
      <Icon size={64} className="text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">{title}</p>
      {description && <p className="text-gray-400 mt-2">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4">
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
