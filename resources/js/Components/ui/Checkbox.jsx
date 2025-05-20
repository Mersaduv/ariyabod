import React, { forwardRef } from "react";

const CustomCheckbox = forwardRef(function CustomCheckboxComponent(props, ref) {
    const {
        label,
        name,
        checked = false,
        onChange,
        customStyle,
        isNormal,
        inLabel,
        statusClass,
    } = props;

    return (
        <div
            className={`flex items-center justify-between ${
                customStyle ? "" : "py-2.5"
            } ${inLabel ? "" : `${statusClass ? statusClass : "w-full"} `}`}
        >
            {/* {inLabel ? null : (
        <span className="w-3/4 font-medium text-gray-700">{label}</span>
      )} */}
            <div dir="ltr" className="flex justify-center">
                <label
                    title={label || ""}
                    htmlFor={`switch-${name}`}
                    className="h-6 relative inline-block"
                >
                    <input
                        id={`switch-${name}`}
                        type="checkbox"
                        name={name}
                        checked={checked}
                        onChange={onChange}
                        ref={ref}
                        className="w-11 h-0 focus:outline-none focus:border-none focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none inline-block focus:outline-0 border-0 after:absolute before:absolute after:top-0 before:top-0 after:block before:inline-block before:rounded-full after:rounded-full after:content-[''] after:w-5 after:h-5 after:mt-0.5 after:ml-0.5 after:shadow-md after:duration-100 before:content-[''] before:w-10 before:h-full before:shadow-[inset_0_0_#000] after:bg-white dark:after:bg-gray-50 before:bg-gray-300 dark:before:bg-gray-300 before:checked:bg-sky-500 checked:after:duration-300 checked:after:translate-x-4 disabled:after:bg-opacity-75 disabled:cursor-not-allowed disabled:checked:before:bg-opacity-40"
                    />
                </label>
            </div>
        </div>
    );
});

export default CustomCheckbox;
