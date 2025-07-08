import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  className,
  ...props 
}) => {
  const colorStyles = {
    primary: "text-primary-600 bg-primary-100",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    danger: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
  };

  const trendStyles = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-slate-600",
  };

  return (
    <Card
      variant="elevated"
      hover={true}
      className={cn("p-6", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <ApperIcon
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"}
                size={14}
                className={cn("mr-1", trendStyles[trend])}
              />
              <span className={cn("text-sm font-medium", trendStyles[trend])}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("p-3 rounded-full", colorStyles[color])}>
            <ApperIcon name={icon} size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;