import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        {onRetry && (
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={onRetry}
            className="shadow-lg hover:shadow-xl"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;