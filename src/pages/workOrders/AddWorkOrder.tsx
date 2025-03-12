import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {toast} from "react-toastify"
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Clock } from "lucide-react";

// Define the form data type
interface AddWorkOrderFormValues {
  title: string;
  asset: string;
  category: string;
  priority: string;
  description: string;
}

interface AddWorkOrderDialogProps {
  onAddWorkOrder: (workOrder: Partial<AddWorkOrderFormValues>) => void;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonClassName?: string;
  buttonIcon?: React.ReactNode;
}

const ASSET_OPTIONS = ["Hydraulic Pump", "Conveyor Belt", "Air Compressor", "Generator"];
const CATEGORY_OPTIONS = ["Damage", "Preventive", "Calibration", "Safety", "Electrical"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const AddWorkOrder: React.FC<AddWorkOrderDialogProps> = ({
  onAddWorkOrder,
  buttonLabel = "Add Work Order",
  buttonVariant = "default",
  buttonClassName = "bg-orange-500 hover:bg-orange-600 text-white",
  buttonIcon
}) => {
  const [open, setOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<AddWorkOrderFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      asset: "",
      category: "",
      priority: "Medium",
      description: ""
    }
  });
  
// In AddWorkOrder.tsx
const onSubmit = async (data: AddWorkOrderFormValues) => {
    try {
      // Show loading indicator
    //   setIsSubmitting(true);
      
      // Make API call
    //   const response = await fetch('/api/workorders', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });
      
    //   if (!response.ok) {
    //     throw new Error('Failed to create work order');
    //   }
      
    //   const result = await response.json();
      
      // Call the parent component's callback with the result
      onAddWorkOrder(data);
      
      // Close dialog and reset form
      reset();
      setOpen(false);
      
      // Show success message
      toast.success('Work order created successfully');
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    } finally {
    //   setIsSubmitting(false);
    }
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
        <Button 
          variant={buttonVariant} 
          className={`flex items-center justify-center gap-2 ${buttonClassName}`}
        >
          {buttonIcon || <Plus size={16} />}
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Create Work Order
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Fill the details to create a new work order.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label 
              htmlFor="title" 
              className={`text-sm font-medium ${errors.title ? "text-red-500" : "dark:text-gray-200"}`}
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter work order title"
              className={`w-full ${errors.title ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
              {...register("title", { 
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters"
                }
              })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          {/* Asset */}
          <div className="space-y-2">
            <Label 
              htmlFor="asset" 
              className="text-sm font-medium dark:text-gray-200"
            >
              Asset
            </Label>
            <Controller
                name="asset"
                control={control}
                rules={{ required: "Asset is required" }}
                render={({ field }) => (
                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_OPTIONS.map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          {asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                  />

            {errors.asset && (
              <p className="mt-1 text-xs text-red-500">{errors.asset.message}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <Label 
              htmlFor="category" 
              className="text-sm font-medium dark:text-gray-200"
            >
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (

                  <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )}/>

            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>
          
          {/* Priority */}
          <div className="space-y-2">
            <Label 
              htmlFor="priority" 
              className="text-sm font-medium dark:text-gray-200"
            >
              Priority
            </Label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: "Priority is required" }}
              render={({ field }) => (

                <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
                >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                {PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              )}/>

            
            {errors.priority && (
              <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>
            )}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label 
              htmlFor="description" 
              className="text-sm font-medium dark:text-gray-200"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter detailed description"
              className="min-h-[100px]"
              {...register("description")}
            />
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
              Create Work Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkOrder;