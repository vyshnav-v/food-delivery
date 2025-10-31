import { type FC } from "react";

import type { FormRowProps } from "../../types/form";

const FormRow: FC<FormRowProps> = ({
  label,
  subLabel,
  title = false,
  hasBorder = true,
  hasBorderSlim = false,
  hasButton = false,
  isVertical = false,
  center,
  direction,
  align,
  hasEqualRowSize,
  hasBottomSpace,
  hideLabel,
  children,
}) => {
  return (
    <div
      className={`flex ${isVertical ? "flex-col" : "flex-col gap-5 sm:flex-row"}
        ${hasBorderSlim ? "mb-3 pb-3" : hasBorder ? "mb-5 pb-5" : hasBottomSpace ? "pb-5" : ""}
        relative ${align ? "items-center" : ""} ${hasEqualRowSize ? "justify-between" : ""}`}
    >
      {!hideLabel && (
        <div
          className={`${hasEqualRowSize ? "basis-3/5 overflow-hidden break-all" : "basis-1/3 "}`}
        >
          {title ? (
            <>
              <h4 className="text-base font-semibold text-gray-900">{label}</h4>
              {subLabel && (
                <p className="text-sm text-gray-600 mt-1">{subLabel}</p>
              )}
            </>
          ) : (
            <>
              <h5 className="text-sm font-medium text-gray-900">{label}</h5>
              {subLabel && (
                <p className="text-xs text-gray-600 mt-0.5">{subLabel}</p>
              )}
            </>
          )}
        </div>
      )}
      <div
        className={`flex gap-5 ${hasEqualRowSize ? "basis-2/5" : hasButton ? "basis-full justify-end" : isVertical ? "basis-full" : hideLabel ? "w-full" : "basis-2/3"}
          ${direction ? "flex-col" : "flex-row"} ${center ? "items-center" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default FormRow;
