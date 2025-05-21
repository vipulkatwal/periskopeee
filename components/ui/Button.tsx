import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Reusable button component.
 * Accepts all standard button props and custom className.
 */
export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}