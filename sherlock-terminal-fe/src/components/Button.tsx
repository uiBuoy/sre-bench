import React from "react"

type Variant = "default" | "destructive" | "outline" | "ghost" | "link"
type Size = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", ...props }, ref) => {
    const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"

    const variantStyles: Record<Variant, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      outline:
        "border border-gray-300 focus:ring-gray-400",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
      link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-400",
    }

    const sizeStyles: Record<Size, string> = {
      default: "h-10 px-4",
      sm: "h-8 px-3 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10 p-0",
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
