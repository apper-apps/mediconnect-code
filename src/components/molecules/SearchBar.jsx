import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  showButton = true,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          icon="Search"
          {...props}
        />
      </div>
      {showButton && (
        <Button
          onClick={handleSearch}
          variant="primary"
          icon="Search"
        >
          Search
        </Button>
      )}
    </div>
  );
};

export default SearchBar;