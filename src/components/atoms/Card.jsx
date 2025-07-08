import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  variant = "default",
  padding = "md",
  hover = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg border transition-all duration-200";
  
  const variants = {
    default: "border-slate-200 shadow-sm",
    elevated: "border-slate-200 shadow-md",
    bordered: "border-slate-300",
    gradient: "bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const hoverStyles = hover ? "hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;