import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/custom_components/theme_provider";
import { Plus } from "lucide-react";

// Define the form data type
interface AddDeviceFormValues {
  deviceId: string;
}

interface AddDeviceDialogProps {
  onClaimDevice: (deviceId: string) => void;
}

const AddDevice: React.FC<AddDeviceDialogProps> = ({ onClaimDevice }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<AddDeviceFormValues>({
    mode: "onChange",
    defaultValues: {
      deviceId: ""
    }
  });
  
  const onSubmit = (data: AddDeviceFormValues) => {
    onClaimDevice(data.deviceId);
    reset();
    setOpen(false);
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 focus:outline-none">
          <Plus size={16} />
          Add Device
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Claim Device
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Enter the device ID to claim your device.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label 
              htmlFor="deviceId" 
              className={`text-sm font-medium ${errors.deviceId ? "text-red-500" : "dark:text-gray-200"}`}
            >
              Device ID
            </Label>
            <Input
              id="deviceId"
              placeholder="Enter device ID"
              className={`w-full 
                ${errors.deviceId ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
              {...register("deviceId", { 
                required: "Device ID is required",
                minLength: {
                  value: 3,
                  message: "Device ID must be at least 3 characters"
                }
              })}
            />
            {errors.deviceId && (
              <p className="mt-1 text-xs text-red-500">{errors.deviceId.message}</p>
            )}
          </div>
          
          <div className="flex justify-center py-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-full max-w-xs">
              <img 
                src="/api/placeholder/200/200" 
                alt="Device claim illustration" 
                className="mx-auto"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!isValid}
              className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Claim Device
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDevice;