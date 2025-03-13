import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/custom_components/theme_provider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronRight, Plus, ChevronLeft } from "lucide-react";

// Example data (replace with your API calls)
const MACHINE_DATA = {
  "001": {
    id: "MACHINE_001",
    name: "Machine 01",
    activeWorkOrders: 10,
    maintenanceRequests: 3,
    completedWorkOrders: 1,
    activeSensors: 7,
    totalSensors: 10,
    serviceTime: 5.2,
    maintenanceItems: [
      { id: 1, name: "Filter Replacement", type: "primary", status: "pending" },
      { id: 2, name: "Motor Repair", type: "danger", status: "urgent" },
      { id: 3, name: "Power Outage", type: "warning", status: "resolved" }
    ],
    urgentRecalls: [
      { id: 1, name: "Urgent Safety Recall", dueDate: "06/04/20xx", completionDate: "06/04/20xx" },
      { id: 2, name: "Urgent Safety Recall", dueDate: "06/04/20xx", completionDate: "06/04/20xx" }
    ],
    serialNumber: "SFL-1208-24",
    efficiency: {
      currentValue: 72,
      chartData: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 50 + Math.random() * 40
      }))
    },
    consumables: [
      { id: 1, name: "Coolant Level", machine: "Milling", status: "Don't Replace", statusColor: "bg-red-500" },
      { id: 2, name: "Resin Tank", machine: "Ion Tank", status: "Still Good", statusColor: "bg-green-500" },
      { id: 3, name: "Carbon Filter", machine: "Water Tank", status: "Need Change", statusColor: "bg-yellow-500" },
      { id: 4, name: "Brass Wire", machine: "Machine", status: "Don't Replace", statusColor: "bg-orange-500" }
    ]
  },
  "MACHINE_002": {
    id: "MACHINE_002",
    name: "Machine 02",
    activeWorkOrders: 8,
    maintenanceRequests: 2,
    completedWorkOrders: 3,
    activeSensors: 5,
    totalSensors: 8,
    serviceTime: 3.7,
    maintenanceItems: [
      { id: 1, name: "Coolant Change", type: "primary", status: "pending" },
      { id: 2, name: "Belt Replacement", type: "warning", status: "scheduled" }
    ],
    urgentRecalls: [
      { id: 1, name: "Urgent Safety Recall", dueDate: "07/15/20xx", completionDate: "pending" }
    ],
    serialNumber: "SFL-1209-18",
    efficiency: {
      currentValue: 68,
      chartData: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 40 + Math.random() * 45
      }))
    },
    consumables: [
      { id: 1, name: "Coolant Level", machine: "Milling", status: "Replace Soon", statusColor: "bg-yellow-500" },
      { id: 2, name: "Resin Tank", machine: "Ion Tank", status: "Still Good", statusColor: "bg-green-500" },
      { id: 3, name: "Carbon Filter", machine: "Water Tank", status: "Good", statusColor: "bg-green-500" },
      { id: 4, name: "Brass Wire", machine: "Machine", status: "Need Replace", statusColor: "bg-red-500" }
    ]
  },
  "MACHINE_003": {
    id: "MACHINE_003",
    name: "Machine 03",
    activeWorkOrders: 10,
    maintenanceRequests: 3,
    completedWorkOrders: 1,
    activeSensors: 7,
    totalSensors: 10,
    serviceTime: 5.2,
    maintenanceItems: [
      { id: 1, name: "Filter Replacement", type: "primary", status: "pending" },
      { id: 2, name: "Motor Repair", type: "danger", status: "urgent" },
      { id: 3, name: "Power Outage", type: "warning", status: "resolved" }
    ],
    urgentRecalls: [
      { id: 1, name: "Urgent Safety Recall", dueDate: "06/04/20xx", completionDate: "06/04/20xx" },
      { id: 2, name: "Urgent Safety Recall", dueDate: "06/04/20xx", completionDate: "06/04/20xx" }
    ],
    serialNumber: "SFL-1208-24",
    efficiency: {
      currentValue: 72,
      chartData: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: 50 + Math.random() * 40
      }))
    },
    consumables: [
      { id: 1, name: "Coolant Level", machine: "Milling", status: "Don't Replace", statusColor: "bg-red-500" },
      { id: 2, name: "Resin Tank", machine: "Ion Tank", status: "Still Good", statusColor: "bg-green-500" },
      { id: 3, name: "Carbon Filter", machine: "Water Tank", status: "Need Change", statusColor: "bg-yellow-500" },
      { id: 4, name: "Brass Wire", machine: "Machine", status: "Don't Replace", statusColor: "bg-orange-500" }
    ]
  }
};

export const MachineDashboard = () => {
  const { machineId } = useParams();
  const [machine, setMachine] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState('day');
  
  // Fetch machine data
  useEffect(() => {
    if (machineId && MACHINE_DATA[machineId]) {
      setMachine(MACHINE_DATA[machineId]);
    }
    // In a real app, you would fetch from API here
  }, [machineId]);
  
  if (!machine) {
    return <div className="flex items-center justify-center h-screen">Loading machine data...</div>;
  }

  return (
    <div className="p-4 sm:p-4 md:py-6  min-h-screen">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <img className="h-8 " src={theme === "light" ? "/logos/logo2.png" : "/logos/ADHVX-WLogo (1).png"} alt="ADHVX" />
            <span className="mx-2 text-gray-500">|</span>
            <h1 className="text-xl font-normal">{machine.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-mainBlue hover:bg-blue-700">
            Next Machine <ChevronRight size={16} />
          </Button>
          {/* <img src="/api/placeholder/32/32" alt="User Profile" className="w-8 h-8 rounded-full" /> */}
        </div>
      </div>

      {/* Machine Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-4xl font-medium">{machine.activeSensors}/{machine.totalSensors}</h2>
              <p className="text-sm text-primary mt-1 ">Total number of active sensors</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-4xl font-medium">{machine.activeWorkOrders}</h2>
              <p className="text-sm text-primary mt-1">Total work orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-4xl font-medium">{machine.maintenanceRequests}</h2>
              <p className="text-sm text-primary mt-1">Maintenance requests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-4xl font-medium">{machine.completedWorkOrders}</h2>
              <p className="text-sm text-primary mt-1">Completed workorders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine Detail Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Main Content Area - Takes up 9/12 of the grid on large screens */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Row - 3 Equal Cards */}
                <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Maintenance Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32">
                        <CircularProgressbar
                        value={75}
                        text={`${machine.serviceTime}h`}
                        styles={buildStyles({
                            textSize: '16px',
                            pathColor: `rgba(62, 152, 199, ${75 / 100})`,
                            textColor: isDark ? '#cdcdcd' : '#333',
                            trailColor: isDark ? '#1f1f1f' : '#e6e6e6',
                            pathTransitionDuration: 0.5,
                        })}
                        />
                        <p className="text-center mt-2 text-sm text-gray-500">Service Time</p>
                    </div>
                    </div>
                </CardContent>
                </Card>

                <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Maintenance Items</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-2">
                    {machine.maintenanceItems.map((item) => (
                        <div key={item.id} className="flex items-center p-2 rounded-md border border-gray-200 dark:border-gray-700">
                        <div 
                            className={`w-3 h-3 rounded-full mr-2 ${
                            item.type === 'primary' ? 'bg-blue-500' : 
                            item.type === 'danger' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                        />
                        <span className="text-sm truncate">{item.name}</span>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2 border-dashed">
                        <Plus size={16} className="mr-2" />
                        <span className="text-sm">Add Parameters</span>
                    </Button>
                    </div>
                </CardContent>
                </Card>

                <Card className="shadow-sm">
                <CardHeader className=''>
                    <CardTitle className="text-lg">Reminder</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <div className="space-y-2">
                    {machine.urgentRecalls.map((recall, index) => (
                        <div key={index} className="grid grid-cols-3 text-sm p-1">
                        <div className="text-gray-800 dark:text-gray-200 truncate">Urgent Safety Recall</div>
                        <div className="text-gray-500 truncate">{recall.dueDate}</div>
                        <div className="text-gray-500 truncate">{recall.completionDate}</div>
                        </div>
                    ))}
                    <Button size="sm" className="mt-2 bg-mainBlue hover:bg-blue-700 text-white">
                        <Plus size={14} className="mr-1" />
                        Add New
                    </Button>
                    </div>
                </CardContent>
                </Card>

                {/* Full Width Card */}
                <Card className="shadow-sm md:col-span-3">
                <CardHeader>
                    <CardTitle className="text-lg">Consumables</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {machine.consumables.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <div className="mb-2">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {item.name.includes("Coolant") && (
                                <path d="M12 5C8.5 5 5 8.5 5 12C5 15.5 8.5 19 12 19C15.5 19 19 15.5 19 12C19 8.5 15.5 5 12 5Z" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Resin") && (
                                <path d="M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Carbon") && (
                                <path d="M7 22H17 M12 2V6 M8 6H16V14C16 16.2091 14.2091 18 12 18C9.79086 18 8 16.2091 8 14V6Z" stroke="currentColor" strokeWidth="2" />
                            )}
                            {item.name.includes("Wire") && (
                                <path d="M9 2V22 M15 2V22 M9 12H15" stroke="currentColor" strokeWidth="2" />
                            )}
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-center">{item.name}</h3>
                        <p className="text-sm text-gray-500 text-center">{item.machine}</p>
                        <div className={`w-full h-1 mt-2 ${item.statusColor}`}></div>
                        <p className="text-xs mt-1 text-center">{item.status}</p>
                        </div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* Sidebar - Takes up 3/12 of the grid on large screens */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                {/* Serial Number / Barcode */}
                <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Serial Number</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                    <div className="my-2 w-full">
                    <img 
                        src="/api/placeholder/300/60" 
                        alt="Barcode" 
                        className="mx-auto max-w-full h-auto"
                    />
                    <p className="text-center mt-2 font-mono text-sm break-all">{machine.serialNumber}</p>
                    </div>
                </CardContent>
                </Card>

                {/* Machine Efficiency */}
                <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Machine Efficiency</CardTitle>
                    <div className="text-sm text-gray-500">30 February 2023</div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex gap-2 mb-4 flex-wrap  justify-center">
                    <Button 
                        size="sm" 
                        variant={timeRange === 'day' ? 'default' : 'outline'}
                        onClick={() => setTimeRange('day')}
                        className={timeRange === 'day' ? 'bg-mainBlue text-white' : ''}
                    >
                        Day
                    </Button>
                    <Button 
                        size="sm" 
                        variant={timeRange === 'week' ? 'default' : 'outline'}
                        onClick={() => setTimeRange('week')}
                        className={timeRange === 'week' ? 'bg-mainBlue text-white' : ''}
                    >
                        Week
                    </Button>
                    <Button 
                        size="sm" 
                        variant={timeRange === 'month' ? 'default' : 'outline'}
                        onClick={() => setTimeRange('month')}
                        className={timeRange === 'month' ? 'bg-mainBlue text-white' : ''}
                    >
                        Month
                    </Button>
                    </div>
                    <div className="h-52 -ml-10 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={machine.efficiency.chartData}>
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                        />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </CardContent>
                </Card>
            </div>
    </div>


    </div>
  );
};

export default MachineDashboard;