import { useState, useEffect } from "react";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState("patient");

  useEffect(() => {
    // In a real application, this would come from authentication context
    // For demo purposes, we'll use localStorage or default to patient
    const savedRole = localStorage.getItem("userRole") || "patient";
    setUserRole(savedRole);
  }, []);

  const switchRole = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem("userRole", newRole);
    // In a real app, this would trigger a re-authentication or role change
  };

  return { userRole, switchRole };
};