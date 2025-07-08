import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "FileText", 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionText = "Get Started",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ApperIcon name={icon} size={24} className="text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        {onAction && (
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAction}
            className="shadow-lg hover:shadow-xl"
          >
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;