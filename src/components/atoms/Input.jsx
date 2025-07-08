import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  icon,
  iconPosition = "left",
  error = false,
  success = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border-slate-300 focus:border-primary-500 focus:ring-primary-500/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50",
  };

  const variant = error ? "error" : success ? "success" : "default";

  return (
    <div className="relative">
      {icon && iconPosition === "left" && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon 
            name={icon} 
            size={16} 
            className={cn(
              "text-slate-400",
              error && "text-red-400",
              success && "text-green-400"
            )} 
          />
        </div>
      )}
      <input
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          icon && iconPosition === "left" && "pl-10",
          icon && iconPosition === "right" && "pr-10",
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon 
            name={icon} 
            size={16} 
            className={cn(
              "text-slate-400",
              error && "text-red-400",
              success && "text-green-400"
            )} 
          />
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;