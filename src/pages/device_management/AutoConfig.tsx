import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { useTheme } from "@/custom_components/theme_provider";
import { Loader2, RotateCcw, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock device data
const MOCK_DEVICES = [
  { id: "device-001", name: "Living Room Sensor" },
  { id: "device-002", name: "Kitchen Sensor" },
  { id: "device-003", name: "Bedroom Sensor" },
  { id: "device-004", name: "Bathroom Sensor" },
  { id: "device-005", name: "Garage Sensor" },
];

interface AutoConfigFormValues {
  selectedDevice: string;
}

interface AutoConfigDialogProps {
  onDeviceSelect: (deviceId: string) => void;
}

const AutoConfig: React.FC<AutoConfigDialogProps> = ({ onDeviceSelect }) => {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundDevices, setFoundDevices] = useState<Array<{ id: string; name: string }>>([]);
  const { theme } = useTheme();
  
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AutoConfigFormValues>({
    mode: "onChange",
    defaultValues: {
      selectedDevice: ""
    }
  });

  const selectedDevice = watch("selectedDevice");
  
  // Automatically search for devices when dialog opens
  useEffect(() => {
    if (open) {
      searchDevices();
    }
  }, [open]);

  // Simulate device search
  const searchDevices = () => {
    setIsSearching(true);
    setFoundDevices([]);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setFoundDevices([]);
      setIsSearching(false);
    }, 2000);
  };
  
  const onSubmit = (data: AutoConfigFormValues) => {
    if (data.selectedDevice) {
      onDeviceSelect(data.selectedDevice);
      reset();
      setOpen(false);
    }
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setFoundDevices([]);
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Zap size={16} />
          Auto config
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Auto Configure Device
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Automatically discovering devices on your network.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label 
              htmlFor="selectedDevice" 
              className={`text-sm font-medium ${errors.selectedDevice ? "text-red-500" : "dark:text-gray-200"}`}
            >
              Available Devices
            </Label>
            <Select 
              onValueChange={(value) => setValue("selectedDevice", value, { shouldValidate: true })}
              value={selectedDevice}
              disabled={isSearching}
            >
              <SelectTrigger className={errors.selectedDevice ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {isSearching ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    <span>Searching for devices...</span>
                  </div>
                ) : foundDevices.length > 0 ? (
                  foundDevices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name} ({device.id})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-gray-500">
                    No devices found
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.selectedDevice && (
              <p className="mt-1 text-xs text-red-500">{errors.selectedDevice.message}</p>
            )}
          </div>
          
          <div className="flex justify-center py-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 w-full">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <Loader2 size={36} className="animate-spin mb-3 text-blue-500" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">Scanning network</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Discovering devices automatically...</p>
                </div>
              ) : foundDevices.length > 0 ? (
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Zap size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Found {foundDevices.length} device(s)
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Select a device from the dropdown above
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 dark:text-gray-300">No devices found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Make sure your devices are powered on and connected
                  </p>
                  <Button 
                    type="button" 
                    onClick={searchDevices} 
                    variant="outline" 
                    className="mt-4"
                  >
                    <RotateCcw size={16} className={`mr-2 ${isSearching ? "animate-spin" : ""}`} />
                    Scan Again
                  </Button>
                </div>
              )}
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
              disabled={!selectedDevice}
              className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Configure Device
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AutoConfig;