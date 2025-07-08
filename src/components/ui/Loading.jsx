import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ className, type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full shimmer-bg animate-shimmer"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded shimmer-bg animate-shimmer mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3 shimmer-bg animate-shimmer"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded shimmer-bg animate-shimmer"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5 shimmer-bg animate-shimmer"></div>
                <div className="h-3 bg-slate-200 rounded w-3/5 shimmer-bg animate-shimmer"></div>
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-8 bg-slate-200 rounded flex-1 shimmer-bg animate-shimmer"></div>
                <div className="h-8 bg-slate-200 rounded flex-1 shimmer-bg animate-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ApperIcon name="Loader2" size={24} className="animate-spin text-primary-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Loading...</h3>
        <p className="text-sm text-slate-600">Please wait while we load your data</p>
      </div>
    </div>
  );
};

export default Loading;