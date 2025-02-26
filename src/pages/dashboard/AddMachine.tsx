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
interface AddMachineFormValues {
  machineName: string;
  machineId: string;
}

interface AddMachineDialogProps {
  onAddMachine: (name: string, id: string) => void;
}

export const AddMachine: React.FC<AddMachineDialogProps> = ({ onAddMachine }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<AddMachineFormValues>({
    mode: "onChange",
    defaultValues: {
      machineName: "",
      machineId: ""
    }
  });
  
  const onSubmit = (data: AddMachineFormValues) => {
    onAddMachine(data.machineName, data.machineId);
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
          Add Machine
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto  border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Add New Machine
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Enter the details of the new machine to monitor.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label 
              htmlFor="machineName" 
              className={`text-sm font-medium ${errors.machineName ? "text-red-500" : "dark:text-gray-200"}`}
            >
              Machine Name
            </Label>
            <Input
              id="machineName"
              placeholder="Enter machine name"
              className={`w-full 
                ${errors.machineName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
              {...register("machineName", { 
                required: "Machine name is required",
                minLength: {
                  value: 3,
                  message: "Machine name must be at least 3 characters"
                }
              })}
            />
            {errors.machineName && (
              <p className="mt-1 text-xs text-red-500">{errors.machineName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label 
              htmlFor="machineId" 
              className={`text-sm font-medium ${errors.machineId ? "text-red-500" : "dark:text-gray-200"}`}
            >
              Machine ID
            </Label>
            <Input
              id="machineId"
              placeholder="Enter machine ID (e.g., MACHINE_004)"
              className={`w-full 
                ${errors.machineId ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
              {...register("machineId", {
                required: "Machine ID is required",
                pattern: {
                  value: /^MACHINE_\d{3}$/,
                  message: "ID must be in format MACHINE_XXX where X is a digit"
                }
              })}
            />
            {errors.machineId && (
              <p className="mt-1 text-xs text-red-500">{errors.machineId.message}</p>
            )}
          </div>
          
          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="w-full sm:w-auto order-2 sm:order-1 "
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!isValid}
              className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Add Machine
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};