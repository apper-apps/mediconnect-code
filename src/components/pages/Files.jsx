import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FileUpload from "@/components/molecules/FileUpload";
import ApperIcon from "@/components/ApperIcon";
import { fileService } from "@/services/api/fileService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Files = ({ userRole = "patient" }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fileCategories = [
    { value: "all", label: "All Files", icon: "FileText" },
    { value: "lab_results", label: "Lab Results", icon: "Flask" },
    { value: "prescriptions", label: "Prescriptions", icon: "Pill" },
    { value: "reports", label: "Reports", icon: "FileText" },
    { value: "images", label: "Images", icon: "Image" },
    { value: "other", label: "Other", icon: "File" },
  ];

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fileService.getAll();
      setFiles(data);
    } catch (err) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFiles) => {
    try {
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      
      for (const file of fileArray) {
        const fileData = {
          fileName: file.name,
          fileType: file.type,
          category: "other",
          uploadDate: new Date().toISOString(),
          patientId: 1,
          patientName: "John Doe",
          size: file.size,
        };
        
        await fileService.create(fileData);
      }
      
      toast.success(`${fileArray.length} file(s) uploaded successfully`);
      await loadFiles();
    } catch (err) {
      toast.error("Failed to upload files");
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await fileService.delete(fileId);
        setFiles(files.filter(f => f.Id !== fileId));
        toast.success("File deleted successfully");
      } catch (err) {
        toast.error("Failed to delete file");
      }
    }
  };

  const handleDownloadFile = (file) => {
    toast.info(`Downloading ${file.fileName}...`);
    // Simulate download
    setTimeout(() => {
      toast.success("File downloaded successfully");
    }, 1000);
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) return "Image";
    if (fileType?.includes("pdf")) return "FileText";
    if (fileType?.includes("word")) return "FileText";
    return "File";
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter(file => 
    filter === "all" || file.category === filter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
          <div className="h-32 bg-slate-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Files</h1>
          <p className="text-sm text-slate-600">
            {userRole === "doctor" 
              ? "View and manage patient medical files" 
              : "Upload and manage your medical documents"
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Search">
            Search Files
          </Button>
          <Button variant="primary" icon="Upload">
            Upload Files
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <FileUpload
        onFileUpload={handleFileUpload}
        acceptedTypes={[".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".txt"]}
        maxSize={10 * 1024 * 1024} // 10MB
        multiple={true}
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {fileCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => setFilter(category.value)}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              filter === category.value
                ? "bg-primary-100 text-primary-700 border-2 border-primary-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            )}
          >
            <ApperIcon name={category.icon} size={14} />
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* File Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Files</p>
              <p className="text-2xl font-bold text-blue-900">{files.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <ApperIcon name="FileText" size={20} className="text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">This Month</p>
              <p className="text-2xl font-bold text-green-900">
                {files.filter(f => {
                  const fileDate = new Date(f.uploadDate);
                  const now = new Date();
                  return fileDate.getMonth() === now.getMonth() && fileDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Upload" size={20} className="text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Size</p>
              <p className="text-2xl font-bold text-purple-900">
                {getFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <ApperIcon name="HardDrive" size={20} className="text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-800">Categories</p>
              <p className="text-2xl font-bold text-orange-900">
                {new Set(files.map(f => f.category)).size}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
              <ApperIcon name="Folder" size={20} className="text-orange-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* File Grid */}
      {filteredFiles.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="FileText" size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No files found</h3>
          <p className="text-slate-600 mb-4">
            {filter === "all" 
              ? "Upload your first medical document to get started" 
              : `No files found in ${fileCategories.find(c => c.value === filter)?.label} category`
            }
          </p>
          <Button variant="primary" icon="Upload">
            Upload Files
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.Id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name={getFileIcon(file.fileType)} size={20} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 truncate">{file.fileName}</h3>
                    <p className="text-sm text-slate-600">
                      {format(new Date(file.uploadDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="ml-2">
                  {file.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <span>{getFileSize(file.size || 0)}</span>
                <span>{file.fileType}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon="Download"
                  onClick={() => handleDownloadFile(file)}
                  className="flex-1"
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Eye"
                  className="flex-1"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  onClick={() => handleDeleteFile(file.Id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Files;