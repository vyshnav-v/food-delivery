import { ChevronDown } from "lucide-react";
import classNames from "classnames";
import React from "react";

import type { SelectOption, SelectProps } from "../../types/form";

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  invalid,
  errorMessage,
  inputRef,
  disabled,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option);
      setIsOpen(false);
    }
  };

  // Dark mode classes
  const containerClass = classNames(
    "relative w-full",
    className,
    disabled && "opacity-60 cursor-not-allowed"
  );

  const triggerClass = classNames(
    "flex items-center justify-between w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200",
    disabled
      ? "bg-gray-100 text-gray-500"
      : "bg-white shadow-sm hover:border-primary-400",
    invalid
      ? "border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-200",
    isOpen && !disabled && !invalid && "border-primary-500 shadow-md"
  );

  const dropdownClass = classNames(
    "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl",
    "max-h-60 overflow-y-auto p-2 space-y-1"
  );

  const optionClass = (option: SelectOption) =>
    classNames(
      "px-3 py-2 text-sm rounded-lg transition-colors duration-150",
      option.disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:bg-primary-50 hover:text-primary-700",
      value?.value === option.value &&
        "bg-primary-100 text-primary-700 font-medium"
    );

  return (
    <div ref={selectRef} className="w-full">
      <div ref={inputRef} className={containerClass}>
        <div
          className={triggerClass}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {value ? value.label : placeholder || "Select..."}
          </span>
          <ChevronDown
            className={`size-4 transition-transform ${
              isOpen ? "rotate-180 transform" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className={dropdownClass}>
            {options.map((option, index) => (
              <div
                key={index}
                className={optionClass(option)}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="mt-1 text-sm text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default Select;
