import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // You can add any custom props here if needed
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, ...rest }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-brand-medium-blue focus:ring-brand-light-blue"
            {...rest}
        />
    );
};

export default Checkbox;