import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FileUpload = ({ 
  onFileUpload, 
  acceptedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className,
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    if (!files || files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) {
      alert("Please select valid files with correct format and size.");
      return;
    }

    setUploading(true);
    try {
      if (onFileUpload) {
        await onFileUpload(multiple ? validFiles : validFiles[0]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-all duration-200 cursor-pointer",
        dragActive ? "border-primary-500 bg-primary-50" : "border-slate-300 hover:border-slate-400",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
      {...props}
    >
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon 
            name={uploading ? "Loader2" : "Upload"} 
            size={24} 
            className={cn(
              "text-slate-500",
              uploading && "animate-spin"
            )} 
          />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {uploading ? "Uploading..." : "Upload Files"}
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Drag and drop files here, or click to select
        </p>
        <div className="space-y-1 text-xs text-slate-500">
          <p>Accepted formats: {acceptedTypes.join(", ")}</p>
          <p>Maximum size: {formatFileSize(maxSize)}</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon="Upload"
          loading={uploading}
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          Select Files
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
      />
    </Card>
  );
};

export default FileUpload;