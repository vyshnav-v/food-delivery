import React from "react";

interface NoDataProps {
  title: string;
}

const NoData: React.FC<NoDataProps> = ({ title }) => {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-6 pb-12 pt-10">
      <div className="flex flex-col items-center justify-start gap-4">
        <svg
          className="relative block size-12 shrink-0 grow-0"
          width={56}
          height={56}
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x={4} y={4} width={48} height={48} rx={24} fill="#d1d5db" />
          <path
            d="M37 37L32.65 32.65M35 27C35 31.4183 31.4183 35 27 35C22.5817 35 19 31.4183 19 27C19 22.5817 22.5817 19 27 19C31.4183 19 35 22.5817 35 27Z"
            stroke="#111827"
            strokeWidth={1.66667}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x={4}
            y={4}
            width={48}
            height={48}
            rx={24}
            stroke="#f3f4f6"
            strokeWidth={8}
          />
        </svg>
        <div className="flex flex-col items-center justify-start gap-1">
          <p className="text-center text-base font-semibold leading-6 text-gray-900">
            No {title} found
          </p>
          {/* {search ? (
            <p className="text-center text-sm leading-5 text-gray-500">
              {` Your search "${search}" did not match any ${title}. Please try again or create add a new ${title}.`}
            </p>
          ) : (
            filterData?.filterquery && (
              <p className="flex-shrink-0 flex-grow-0 self-stretch whitespace-pre-wrap text-center text-sm leading-5 text-gray-500">
                Your filter did not match any {title}. Please try again or
                create add a new {title}.
              </p>
            )
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NoData;
