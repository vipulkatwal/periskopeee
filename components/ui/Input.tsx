import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Reusable input component with label.
 */
export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
      <input
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        {...props}
      />
    </div>
  );
}