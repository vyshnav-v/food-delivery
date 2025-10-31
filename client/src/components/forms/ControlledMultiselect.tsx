import React from "react";
import { Controller } from "react-hook-form";

interface ControlledMultiselectProps {
  name: string;
  control: any;
  options?: any[];
  selectedValues?: any[];
  setSelectedValues?: React.Dispatch<React.SetStateAction<any[]>>;
  displayValue?: string;
  rules?: any;
}

const ControlledMultiselect: React.FC<ControlledMultiselectProps> = ({
  name,
  control,
  rules,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={[] as any}
      render={({ field, fieldState: { error } }) => (
        <div tabIndex={0} ref={field.ref} className="multiselect-wrapper">
          {/* TODO: Install multiselect-react-dropdown if needed */}
          <div className="text-sm text-gray-500">
            Multiselect component - install multiselect-react-dropdown package
          </div>
          {error && (
            <p className="errorMessage text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default ControlledMultiselect;
