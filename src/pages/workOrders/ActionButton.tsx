import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// Define props for ActionButton component
export type ActionButtonProps = {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
  apiEndpoint?: string;
  apiMethod?: "GET" | "POST" | "PUT" | "DELETE";
  apiPayload?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  variant = "default",
  onClick,
  apiEndpoint,
  apiMethod = "GET",
  apiPayload,
  onSuccess,
  onError,
  className = "",
  disabled = false,
  size = "default",
  requiresConfirmation = false,
  confirmationMessage = "Are you sure you want to perform this action?"
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    // If confirmation is required, show confirmation dialog
    if (requiresConfirmation) {
      const confirmed = window.confirm(confirmationMessage);
      if (!confirmed) return;
    }

    // If onClick is provided, call it directly (for state updates without API)
    if (onClick) {
      onClick();
      return;
    }

    // If apiEndpoint is provided, make API call
    if (apiEndpoint) {
      try {
        setLoading(true);
        
        const options: RequestInit = {
          method: apiMethod,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        
        // Add body for POST, PUT methods
        if (apiPayload && (apiMethod === 'POST' || apiMethod === 'PUT')) {
          options.body = JSON.stringify(apiPayload);
        }
        
        const response = await fetch(apiEndpoint, options);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data);
        }
        
        toast("Operation completed successfully", { type: "success" });
      } catch (error) {
        console.error("API call failed:", error);
        
        // Call onError callback if provided
        if (onError) {
          onError(error);
        }
        
        toast("Failed to complete operation", { type: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {label}
    </Button>
  );
};

export default ActionButton;