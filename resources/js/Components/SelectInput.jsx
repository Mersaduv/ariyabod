import React from 'react';

export default function SelectInput({ className = '', disabled = false, children, ...props }) {
    return (
        <select
            {...props}
            disabled={disabled}
            className={
                `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                    disabled && 'opacity-50'
                } ` + className
            }
        >
            {children}
        </select>
    );
}
