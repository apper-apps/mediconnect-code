import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavLink = ({ 
  to, 
  icon, 
  children, 
  className,
  mobile = false,
  ...props 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseStyles = "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-600";
  const activeStyles = "bg-primary-100 text-primary-700 border-l-4 border-primary-600";
  const inactiveStyles = "text-slate-600 hover:text-slate-900";
  
  const mobileStyles = mobile ? "justify-center flex-col py-3 px-2" : "";

  return (
    <RouterNavLink
      to={to}
      className={cn(
        baseStyles,
        isActive ? activeStyles : inactiveStyles,
        mobileStyles,
        className
      )}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={mobile ? 20 : 18} 
          className={cn(
            mobile ? "mb-1" : "mr-3",
            isActive ? "text-primary-700" : "text-slate-500"
          )} 
        />
      )}
      <span className={cn(mobile && "text-xs")}>{children}</span>
    </RouterNavLink>
  );
};

export default NavLink;