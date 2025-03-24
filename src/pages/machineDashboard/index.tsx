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
import { ChevronRight,   Activity,        // For Utilization Rate
  AlertCircle,     // For Downtime
  Clock,           // For Operating Hours
  ArrowRight,      // For Wire Feed Rate
  Timer,           // For Machining Time
  Power,           // For Machine State
  Disc,            // For Spools/Wire
  Filter,          // For Filter Life
  Zap,             // For Electricity
  Thermometer  } from "lucide-react";

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
    ],
    machineMetrics: {
      utilizationRate: 78.5,
      downtime: 2.3,
      operatingHours: 21.7,
      wireFeedRate: 12.4,
      machiningTime: 18.2,
      machineState: "RUNNING",
      spoolsWire: 3.5,
      filterLife: 65,
      electricity: {
        consumption: 145.2,
        cost: 23.45
      },
      waterTemperature: 24.7
    }
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
    ],
    machineMetrics: {
      utilizationRate: 65.2,
      downtime: 4.7,
      operatingHours: 19.3,
      wireFeedRate: 10.8,
      machiningTime: 15.7,
      machineState: "WAITING",
      spoolsWire: 2.8,
      filterLife: 37,
      electricity: {
        consumption: 132.6,
        cost: 21.18
      },
      waterTemperature: 25.3
    }
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
    ],
    machineMetrics: {
      utilizationRate: 81.3,
      downtime: 1.8,
      operatingHours: 22.2,
      wireFeedRate: 13.2,
      machiningTime: 19.5,
      machineState: "RUNNING",
      spoolsWire: 4.2,
      filterLife: 78,
      electricity: {
        consumption: 152.7,
        cost: 24.83
      },
      waterTemperature: 23.9
    }
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
              <div className="lg:col-span-8 grid grid-cols-1 gap-6 ">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Machine Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                      {/* Machine State */}
                          <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className="p-2 bg-gray-100 rounded-full mr-2">
                                    <Power size={18} className="text-gray-700" />
                                  </div>
                                  <h3 className="font-medium text-left">Machine State</h3>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className={`mr-2 text-xl font-semibold px-3 py-1 rounded-full flex items-center ${
                                  machine.machineMetrics.machineState === "RUNNING" ? "bg-green-100 text-green-700" :
                                  machine.machineMetrics.machineState === "WAITING" ? "bg-yellow-100 text-yellow-700" :
                                  machine.machineMetrics.machineState === "IDLE" ? "bg-blue-100 text-blue-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    machine.machineMetrics.machineState === "RUNNING" ? "bg-green-500" :
                                    machine.machineMetrics.machineState === "WAITING" ? "bg-yellow-500" :
                                    machine.machineMetrics.machineState === "IDLE" ? "bg-blue-500" :
                                    "bg-red-500"
                                  }`}></div>
                                  {machine.machineMetrics.machineState}
                                </div>
                              </div>
                            </div>

                      {/* Utilization Rate */}
                      <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-full mr-2">
                              <Activity size={18} className="text-blue-700" />
                            </div>
                            <h3 className="font-medium text-left">Utilization Rate</h3>
                          </div>
                        </div>
                        <div className="flex items-end">
                          <div className="mr-2 text-3xl font-semibold text-blue-800">
                            {machine.machineMetrics.utilizationRate}
                          </div>
                          <span className="text-blue-600 text-base">/ hour</span>
                        </div>
                      </div>

                        {/* Downtime */}
                        <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="p-2 bg-red-100 rounded-full mr-2">
                                <AlertCircle size={18} className="text-red-700" />
                              </div>
                              <h3 className="font-medium text-left">Downtime</h3>
                            </div>
                          </div>
                          <div className="flex items-end">
                            <div className="mr-2 text-3xl font-semibold text-red-800">
                              {machine.machineMetrics.downtime}
                            </div>
                            <span className="text-red-600 text-base">hours</span>
                          </div>
                        </div>

                          {/* Operating Hours */}
                          <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-full mr-2">
                                  <Clock size={18} className="text-green-700" />
                                </div>
                                <h3 className="font-medium text-left">Operating Hours</h3>
                              </div>
                            </div>
                            <div className="flex items-end">
                              <div className="mr-2 text-3xl font-semibold text-green-800">
                                {machine.machineMetrics.operatingHours}
                              </div>
                              <span className="text-green-600 text-base">total</span>
                            </div>
                          </div>

                          {/* Wire Feed Rate */}
                            <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className="p-2 bg-purple-100 rounded-full mr-2">
                                    <ArrowRight size={18} className="text-purple-700" />
                                  </div>
                                  <h3 className="font-medium text-left">Wire Feed Rate</h3>
                                </div>
                              </div>
                              <div className="flex items-end">
                          <div className="mr-2 text-3xl font-semibold text-purple-800">
                                  {machine.machineMetrics.wireFeedRate}
                                </div>
                                <span className="text-purple-600 text-base">m/min</span>
                              </div>
                          </div>

                            {/* Machining Time */}
                            <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className="p-2 bg-indigo-100 rounded-full mr-2">
                                    <Timer size={18} className="text-indigo-700" />
                                  </div>
                                  <h3 className="font-medium text-left">Machining Time</h3>
                                </div>
                              </div>
                              <div className="flex items-end">
                                <div className="mr-2 text-3xl font-semibold text-indigo-800">
                                  {machine.machineMetrics.machiningTime}
                                </div>
                                <span className="text-indigo-600 text-base">hours</span>
                              </div>
                            </div>


                            {/* Spools/Wire */}
                            <div className="p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between ">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className="p-2 bg-amber-100 rounded-full mr-2">
                                    <Disc size={18} className="text-amber-700" />
                                  </div>
                                  <h3 className="font-medium text-left">No of spools / wire</h3>
                                </div>
                              </div>
                              <div className="flex items-end">
                                <div className="mr-2 text-3xl font-semibold text-amber-800">
                                  {machine.machineMetrics.spoolsWire}
                                </div>
                                <span className="text-amber-600 text-base">units</span>
                              </div>
                            </div>

                              {/* Filter Life */}
                              <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div className="p-2 bg-cyan-100 rounded-full mr-2">
                                      <Filter size={18} className="text-cyan-700" />
                                    </div>
                                    <h3 className="font-medium text-left">Filter Life</h3>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-16 h-16 mr-4">
                                    <CircularProgressbar 
                                      value={machine.machineMetrics.filterLife} 
                                      text={`${machine.machineMetrics.filterLife}%`} 
                                      styles={buildStyles({
                                        textSize: '28px',
                                        pathColor: machine.machineMetrics.filterLife > 50 ? '#10b981' : 
                                                machine.machineMetrics.filterLife > 20 ? '#f59e0b' : '#ef4444',
                                        textColor: isDark ? '#fff' : '#333',
                                      })}
                                    />
                                  </div>
                                  <span className="text-cyan-600 text-base ml-2">
                                    {machine.machineMetrics.filterLife > 50 ? "Good" : 
                                    machine.machineMetrics.filterLife > 20 ? "Warning" : "Critical"}
                                  </span>
                                </div>
                              </div>

                              {/* Electricity */}
                              <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-full mr-2">
                                      <Zap size={18} className="text-yellow-700" />
                                    </div>
                                    <h3 className="font-medium text-left">Electricity</h3>
                                  </div>
                                </div>
                                <div className="flex items-end ">
                                  <div className="mr-2 text-3xl font-semibold text-yellow-800">
                                    {machine.machineMetrics.electricity.consumption}
                                  </div>
                                  <span className="text-yellow-600 text-base">kWh</span>
                                </div>
                              </div>

                              {/* Water Temperature */}
                              <div className="p-4 rounded-lg shadow-sm border border-gray-100 ">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div className="p-2 bg-teal-100 rounded-full mr-2">
                                      <Thermometer size={18} className="text-teal-700" />
                                    </div>
                                    <h3 className="font-medium text-left">Water Temperature</h3>
                                  </div>
                                </div>
                                <div className="flex items-end">
                                  <div className="mr-2 text-3xl font-semibold text-teal-800">
                                    {machine.machineMetrics.waterTemperature}
                                  </div>
                                  <span className="text-teal-600 text-base">°C</span>
                                </div>
                              </div>
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