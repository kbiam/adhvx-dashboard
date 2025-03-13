import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from "./WorkOrders";

// Define the form data type
interface EditWorkOrderFormValues {
  title: string;
  asset: string;
  category: string;
  priority: string;
  description: string;
  status: WorkOrderStatus;
}

interface EditWorkOrderDialogProps {
  workOrder: WorkOrder;
  onEditWorkOrder: (id: string, workOrder: Partial<EditWorkOrderFormValues>) => void;
  buttonLabel?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonClassName?: string;
  buttonIcon?: React.ReactNode;
}

const ASSET_OPTIONS = ["Hydraulic Pump", "Conveyor Belt", "Air Compressor", "Generator"];
const CATEGORY_OPTIONS = ["Damage", "Preventive", "Calibration", "Safety", "Electrical"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const STATUS_OPTIONS = ["Open", "In Progress", "On Hold", "Closed", "Completed"];

const EditWorkOrder: React.FC<EditWorkOrderDialogProps> = ({
  workOrder,
  onEditWorkOrder,
  buttonLabel = "Edit",
  buttonVariant = "ghost",
  buttonClassName = "h-8 w-8 p-0",
  buttonIcon
}) => {
  const [open, setOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<EditWorkOrderFormValues>({
    mode: "onChange",
    defaultValues: {
      title: workOrder.title || "",
      asset: workOrder.asset || "",
      category: workOrder.category || "",
      priority: workOrder.priority || "Medium",
      status: workOrder.status || "Open",
      description: ""  // Assuming the original data doesn't have a description field
    }
  });
  
  // Reset form when workOrder changes
  useEffect(() => {
    if (workOrder) {
      reset({
        title: workOrder.title || "",
        asset: workOrder.asset || "",
        category: workOrder.category || "",
        priority: workOrder.priority || "Medium",
        status: workOrder.status || "Open",
        description: ""
      });
    }
  }, [workOrder, reset]);

  const onSubmit = async (data: EditWorkOrderFormValues) => {
    try {
      // Call the parent component's callback with the data
      onEditWorkOrder(workOrder.id, data);
      
      // Close dialog and reset form
      setOpen(false);
      
      // Show success message
      toast.success('Work order updated successfully');
    } catch (error) {
      console.error('Error updating work order:', error);
      toast.error('Failed to update work order');
    }
  };
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset to the current workOrder data when dialog closes
      reset({
        title: workOrder.title || "",
        asset: workOrder.asset || "",
        category: workOrder.category || "",
        priority: workOrder.priority || "Medium",
        status: workOrder.status || "Open",
        description: ""
      });
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={buttonClassName}
        >
          {buttonIcon || <Edit className="h-4 w-4" />}
          {buttonLabel === "Edit" ? "" : buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[90%] mx-auto border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold dark:text-gray-100">
            Edit Work Order
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Update the details of work order #{workOrder.workOrderId}
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
                  value={field.value}
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
                  value={field.value}
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
              )}
            />
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
                  value={field.value}
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
              )}
            />
            {errors.priority && (
              <p className="mt-1 text-xs text-red-500">{errors.priority.message}</p>
            )}
          </div>
          
          {/* Status - Additional field for editing */}
          <div className="space-y-2">
            <Label 
              htmlFor="status" 
              className="text-sm font-medium dark:text-gray-200"
            >
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>
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
              className="w-full sm:w-auto order-1 sm:order-2 bg-mainBlue text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Update Work Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkOrder;