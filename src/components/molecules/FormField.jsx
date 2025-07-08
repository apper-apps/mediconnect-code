import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  success,
  required = false,
  className,
  containerClassName,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return <Select error={!!error} success={!!success} {...props} />;
      case "textarea":
        return <TextArea error={!!error} success={!!success} {...props} />;
      default:
        return <Input type={type} error={!!error} success={!!success} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-1", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={className}>
        {renderInput()}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 mt-1">{success}</p>
      )}
    </div>
  );
};

export default FormField;