import React from "react";
import { cn } from "@/utils/cn";

const TextArea = React.forwardRef(({ 
  className, 
  rows = 4,
  error = false,
  success = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none";
  
  const variants = {
    default: "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50",
  };

  const variant = error ? "error" : success ? "success" : "default";

  return (
    <textarea
      rows={rows}
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;