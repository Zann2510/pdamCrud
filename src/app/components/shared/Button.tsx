import { ReactNode } from "react"

// Interface untuk props
interface ButtonProps {
  children: ReactNode;           // Isi button (text/icon)
  onClick?: () => void;          // Handler saat diklik
  type?: "button" | "submit";    // Type HTML button
  variant?: "primary" | "secondary" | "danger"; // Style variant
  disabled?: boolean;            // Disabled state
  className?: string;            // Custom className tambahan
  fullWidth?: boolean;           // Button full width atau tidak
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  
  // Base classes yang selalu ada
  const baseClasses = `
    px-4 py-2
    rounded-lg
    font-medium
    transition-all
    duration-200
    disabled:opacity-50
    disabled:cursor-not-allowed
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
  `
  
  // Variant classes
  const variantClasses = {
    primary: `
      bg-blue-500 
      text-white 
      hover:bg-blue-600
      focus:ring-blue-500
    `,
    secondary: `
      bg-gray-200 
      text-gray-800 
      hover:bg-gray-300
      focus:ring-gray-500
    `,
    danger: `
      bg-red-500 
      text-white 
      hover:bg-red-600
      focus:ring-red-500
    `,
  }
  
  // Width class
  const widthClass = fullWidth ? "w-full" : ""
  
  // Gabungkan semua classes
  const finalClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${widthClass}
    ${className}
  `.trim()
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  )
}