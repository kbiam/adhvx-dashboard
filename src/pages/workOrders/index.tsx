import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddWorkOrder from './AddWorkOrder';
import ActionButton from './ActionButton';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Calendar,
  Tag
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditWorkOrder from './EditWorkOrder';

// Define types
export type WorkOrderStatus = "Open" | "In Progress" | "On Hold" | "Closed" | "Completed";
export type WorkOrderPriority = "High" | "Medium" | "Low";

export type WorkOrder = {
  id: string;
  title: string;
  workOrderId: string;
  asset: string;
  assetType: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  date: string;
  category: string;
};

// Define priority options for filtering
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

// Define category options for filtering
const CATEGORY_OPTIONS = [
  "Damage",
  "Preventive",
  "Calibration",
  "Safety",
  "Electrical"
];

// Define status options for filtering
const STATUS_OPTIONS = [
  "Open",
  "In Progress",
  "On Hold",
  "Closed",
  "Completed"
];

// Define asset options for filtering
const ASSET_OPTIONS = [
  "Hydraulic Pump"
];

const WorkOrders = () => {
  // State for work orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: "1",
      title: "Fix Hydraulic Leak",
      workOrderId: "WO-1",
      asset: "Hydraulic Pump",
      assetType: "Hydraulic Pump",
      status: "Open",
      priority: "High",
      date: "December 15th 2024, 10:55 am",
      category: "Damage"
    },
    {
      id: "2",
      title: "Replace Oil Filter",
      workOrderId: "WO-2",
      asset: "Hydraulic Pump",
      assetType: "Hydraulic Pump",
      status: "In Progress",
      priority: "Medium",
      date: "December 14th 2024, 10:55 am",
      category: "Preventive"
    },
    {
      id: "3",
      title: "Calibrate Pressure Sensor",
      workOrderId: "WO-3",
      asset: "Hydraulic Pump",
      assetType: "Hydraulic Pump",
      status: "On Hold",
      priority: "Low",
      date: "December 13th 2024, 10:55 am",
      category: "Calibration"
    },
    {
      id: "4",
      title: "Install Safety Guard",
      workOrderId: "WO-4",
      asset: "Hydraulic Pump",
      assetType: "Hydraulic Pump",
      status: "Completed",
      priority: "Low",
      date: "December 12th 2024, 10:55 am",
      category: "Safety"
    },
    {
      id: "5",
      title: "Check Electrical Connections",
      workOrderId: "WO-5",
      asset: "Hydraulic Pump",
      assetType: "Hydraulic Pump",
      status: "Closed",
      priority: "Medium",
      date: "December 11th 2024, 10:55 am",
      category: "Electrical"
    }
  ]);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  // Calculate counts
  const totalWorkOrders = workOrders.length;
  const openWorkOrders = workOrders.filter(wo => wo.status === "Open").length;
  const inProgressWorkOrders = workOrders.filter(wo => wo.status === "In Progress").length;
  const closedWorkOrders = workOrders.filter(wo => wo.status === "Closed" || wo.status === "Completed").length;

  // Filtered work orders based on search query and filters
  const filteredWorkOrders = workOrders.filter(order => {
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.workOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.asset.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply priority filter
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(order.priority);
    
    // Apply category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(order.category);
    
    // Apply status filter
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status);
    
    // Apply asset filter
    const matchesAsset = selectedAssets.length === 0 || selectedAssets.includes(order.asset);
    
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus && matchesAsset;
  });

  // Functions to handle work order actions
  const handleAddWorkOrder = (workOrderData) => {
    // Generate a unique ID and work order ID
    const newId = (workOrders.length + 1).toString();
    const newWorkOrderId = `WO-${newId}`;
    
    // Create new work order object
    const newWorkOrder = {
      id: newId,
      workOrderId: newWorkOrderId,
      title: workOrderData.title,
      asset: workOrderData.asset,
      assetType: workOrderData.asset, // Using asset as assetType for simplicity
      status: "Open",
      priority: workOrderData.priority as WorkOrderPriority,
      date: new Date().toLocaleString(),
      category: workOrderData.category
    };
    
    // Add to work orders state
    setWorkOrders([...workOrders, newWorkOrder]);
  };

    const startWorkOrder = (id: string) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { ...order, status: "In Progress" } : order
      )
    );
  };

  const pauseWorkOrder = (id: string) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { ...order, status: "On Hold" } : order
      )
    );
  };

  const continueWorkOrder = (id: string) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { ...order, status: "In Progress" } : order
      )
    );
  };

  const closeWorkOrder = (id: string) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { ...order, status: "Closed" } : order
      )
    );
  };

  const reopenWorkOrder = (id: string) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { ...order, status: "Open" } : order
      )
    );
  };

  const deleteWorkOrder = (id: string) => {
    if (window.confirm("Are you sure you want to delete this work order?")) {
      setWorkOrders(workOrders.filter(order => order.id !== id));
    }
  };

  const updateWorkOrder = (id: string, workOrderData: Partial<WorkOrder>) => {
    setWorkOrders(
      workOrders.map(order => 
        order.id === id ? { 
          ...order, 
          title: workOrderData.title || order.title,
          asset: workOrderData.asset || order.asset,
          assetType: workOrderData.asset || order.assetType,
          category: workOrderData.category || order.category,
          priority: workOrderData.priority as WorkOrderPriority || order.priority,
          status: workOrderData.status || order.status
        } : order
      )
    );
  };

  // Function to get priority badge color
  const getPriorityBadgeColor = (priority: WorkOrderPriority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: WorkOrderStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "On Hold":
        return "bg-purple-100 text-purple-700";
      case "Closed":
        return "bg-gray-100 text-gray-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Render action buttons based on work order status
  const renderActionButtons = (order: WorkOrder) => {
    switch (order.status) {
      case "Open":
        return (
          <ActionButton
            label="Start WorkOrder"
            variant="default"
            className="bg-mainBlue hover:bg-blue-700 text-white"
            onClick={() => startWorkOrder(order.id)}
          />
        );
      case "In Progress":
        return (
          <ActionButton
            label="On Hold"
            variant="default"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => pauseWorkOrder(order.id)}
          />
        );
      case "On Hold":
        return (
          <ActionButton
            label="Continue"
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => continueWorkOrder(order.id)}
          />
        );
      case "Completed":
      case "Closed":
        return (
          <div className="flex space-x-2">
            <ActionButton
              label="Close"
              variant="default"
              className="bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => closeWorkOrder(order.id)}
            />
            <ActionButton
              label="Re Open"
              variant="default"
              className="bg-mainBlue hover:bg-blue-700 text-white"
              onClick={() => reopenWorkOrder(order.id)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-4 md:py-6  min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-semibold">
            Work Orders
          </h1>
        </div>
        
        <div className="flex space-x-4">
        <AddWorkOrder
            onAddWorkOrder={handleAddWorkOrder}
            buttonLabel="Add Work Order"
            buttonClassName="w-full bg-mainBlue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 focus:outline-none"
        />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <div className="relative flex-grow">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {PRIORITY_OPTIONS.map((priority) => (
              <DropdownMenuCheckboxItem
                key={priority}
                checked={selectedPriorities.includes(priority)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPriorities([...selectedPriorities, priority]);
                  } else {
                    setSelectedPriorities(
                      selectedPriorities.filter((p) => p !== priority)
                    );
                  }
                }}
              >
                {priority}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedPriorities.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedPriorities([]);
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORY_OPTIONS.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category]);
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    );
                  }
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedCategories.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedCategories([]);
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStatuses([...selectedStatuses, status]);
                  } else {
                    setSelectedStatuses(
                      selectedStatuses.filter((s) => s !== status)
                    );
                  }
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedStatuses.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedStatuses([]);
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Assets Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Assets
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Assets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ASSET_OPTIONS.map((asset) => (
              <DropdownMenuCheckboxItem
                key={asset}
                checked={selectedAssets.includes(asset)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAssets([...selectedAssets, asset]);
                  } else {
                    setSelectedAssets(
                      selectedAssets.filter((a) => a !== asset)
                    );
                  }
                }}
              >
                {asset}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedAssets.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  setSelectedAssets([]);
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" className="ml-auto">
          Export
        </Button>
        
        <Button variant="outline">
          View
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-md font-medium">Total Work Order</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{totalWorkOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-md font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{openWorkOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-md font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{inProgressWorkOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-md font-medium">Closed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{closedWorkOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWorkOrders.map((order) => (
          <div 
            key={order.id} 
            className={`border-[1.5px] rounded-lg overflow-hidden 
              ${order.priority === "High" ? "border-red-400 dark:border-red-400/50" : 
                order.priority === "Medium" ? "border-yellow-400 dark:border-yellow-400/50" : 
                order.priority === "Low" ? "border-green-400 dark:border-green-400/50" :
                "border-gray-300"}`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-medium text-sm truncate max-w-[70%]">{order.title}</h3>
              <span className="text-sm text-gray-500">#{order.workOrderId}</span>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{order.assetType}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{order.date}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{order.category}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border-t bg-gray-50 dark:bg-primary-foreground">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
              
              <div className="flex space-x-2">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => console.log("Edit", order)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button> */}
                <EditWorkOrder
                workOrder={order}
                onEditWorkOrder={updateWorkOrder}

                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteWorkOrder(order.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-t">
              {renderActionButtons(order)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredWorkOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg mt-4">
          <XCircle className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No Work Orders Found</h3>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkOrders;