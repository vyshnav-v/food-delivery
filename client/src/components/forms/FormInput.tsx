import { Eye, EyeOff } from "lucide-react";
import classNames from "classnames";
import { type FC, useMemo, useState } from "react";

import type { FormInputProps } from "../../types/form";

const FormInput: FC<FormInputProps> = ({
  type = "text",
  invalid,
  form,
  disabled,
  textArea,
  name,
  validate,
  style,
  label,
  hasWrapper,
  errorMessage,
  right,
  className,
  ...rest
}) => {
  const [pwInputType, setPwInputType] = useState<"password" | "text">(
    "password"
  );
  const isInvalid = useMemo(() => invalid ?? false, [invalid]);

  const inputDefaultClass =
    "w-full px-4 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2";
  const inputClass = classNames(
    inputDefaultClass,
    disabled && "bg-gray-100 cursor-not-allowed opacity-60",
    isInvalid
      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    textArea && "resize-none min-h-[100px]",
    className
  );

  const renderTextArea = (
    <textarea
      {...(form &&
        form.register(
          name,
          validate && typeof validate === "object" ? validate : undefined
        ))}
      style={style}
      className={inputClass}
      disabled={disabled}
      placeholder={rest.placeholder}
    />
  );

  const onPasswordVisibleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPwInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  const renderInput = (
    <div className="relative">
      {type === "date" ? (
        <>
          {/* <DateTimepicker
            className="mt-2"
            size="sm"
            placeholder={label}
            value={
              form?.watch(name) || form?.getValues(name)
                ? new Date(form.getValues(name) || form.watch(name))
                : null
            }
            onChange={(date) => {
              form.setValue(name, date);
              form.trigger(name);
            }}
          /> */}
        </>
      ) : type === "radio" ? (
        <>
          {/* <Radio.Group
          name={name}
          disabled={disabled}
          value={form?.getValues(name)}
          className="mt-1 flex w-full flex-col gap-3"
          onChange={(e) => {
            form.setValue(name, e);
            form.trigger(name);
          }}
        >
          {values?.map((value, i) => (
            <Radio
              key={i}
              value={value?.value}
              className="flex w-full items-center justify-between rounded-lg border border-gray-100 p-4 text-sm"
            >
              <div className="flex w-full flex-col">
                <span className="font-medium text-gray-900">{value?.label}</span>
                <span className="font-medium text-gray-500">{value?.subLabel}</span>
              </div>
            </Radio>
          ))}
        </Radio.Group> */}
        </>
      ) : (
        <>
          <input
            disabled={disabled}
            type={type === "password" ? pwInputType : type}
            className={inputClass}
            {...(form &&
              form.register(
                name,
                validate && typeof validate === "object" ? validate : undefined
              ))}
            {...rest}
          />
          {right && (
            <div
              className={`absolute ${isInvalid ? "border-red-500" : "border-gray-300"} inset-y-0 right-0 flex size-10 items-center justify-center rounded-r-md border-y border-r bg-gray-100 text-sm`}
            >
              {right}
            </div>
          )}
          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onPasswordVisibleClick}
            >
              {pwInputType === "password" ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className={`w-full ${hasWrapper && "my-2"}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      {textArea ? renderTextArea : renderInput}
      {errorMessage && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;
