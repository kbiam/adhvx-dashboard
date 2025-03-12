import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Input } from "@/components/ui/input";
import { useTheme } from "@/custom_components/theme_provider";
import { ArrowRight, CircuitBoardIcon, CpuIcon, Settings, Wallet, PackageOpen,IndianRupee, Clock, Timer, Zap, CheckCircle2, AlertTriangle, AlertCircle, ClipboardCheck, CheckCircle, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddMachine } from "./AddMachine";

// Dummy data to simulate backend response
const DUMMY_MACHINES = [
  { _id: "MACHINE_001" },
  { _id: "MACHINE_002" },
  { _id: "MACHINE_003" },
];

const DUMMY_SENSOR_DATA = {
  "MACHINE_001": {
    machineId: "MACHINE_001",
    sensors: {
      "TEMP_SENSOR_01": [
        { parameter: "temperature", value: "75.5°C", timestamp: new Date().toISOString() },
        { parameter: "humidity", value: "45%", timestamp: new Date().toISOString() }
      ],
      "PRESSURE_SENSOR_01": [
        { parameter: "pressure", value: "1013 hPa", timestamp: new Date().toISOString() },
        { parameter: "altitude", value: "150m", timestamp: new Date().toISOString() }
      ]
    }
  },
  "MACHINE_002": {
    machineId: "MACHINE_002",
    sensors: {
      "VOLT_SENSOR_01": [
        { parameter: "voltage", value: "220V", timestamp: new Date().toISOString() },
        { parameter: "current", value: "5A", timestamp: new Date().toISOString() }
      ]
    }
  },
  "MACHINE_003": {
    machineId: "MACHINE_003",
    sensors: {
      "FLOW_SENSOR_01": [
        { parameter: "flow_rate", value: "2.5 L/min", timestamp: new Date().toISOString() },
        { parameter: "pressure", value: "2.1 bar", timestamp: new Date().toISOString() }
      ],
      "TEMP_SENSOR_02": [
        { parameter: "temperature", value: "82.3°C", timestamp: new Date().toISOString() }
      ]
    }
  }
};
const DUMMY_ALERTS = [
  {
    date: 'Monday, 6th April 2024',
    message: 'Due for machine 8 maintenance',
    status: 'completed'
  },
  {
    date: 'Thursday, 24th October 2025',
    message: 'Machine 3 filter has been marked for recall',
    status: 'pending'
  },
  {
    date: 'Monday, 13th August 2025',
    message: 'Maintenance Completed: Machine 5',
    status: 'completed'
  }
];

// Define interfaces for your data structures
interface Machine {
  _id: string;
  status?: 'active' | 'inactive' | 'maintenance';
  lastUpdated?: string;
}

interface SensorReading {
  parameter: string;
  value: string;
  timestamp: string;
}

interface MachineData {
  machineId: string;
  sensors: Record<string, SensorReading[]>;
}

interface Alert {
  id: string;
  date: string;
  message: string;
  status: 'pending' | 'completed' | 'warning';
  priority?: 'low' | 'medium' | 'high';
}


export const Dashboard = () => {
  const {theme} = useTheme()
  const [machines, setMachines] = useState<Machine[]>(DUMMY_MACHINES);
  const [selectedTab, setSelectedTab] = useState('Overall Performance');
  const isDark = theme === "dark";

  const addNewMachine = (name: string, id: string) => {
    // Create a new machine object
    const newMachine: Machine = {
      _id: id,
      status: 'active',
      lastUpdated: new Date().toISOString()
    };
    
    // Add to machines state
    setMachines(prevMachines => [...prevMachines, newMachine]);
    
    // Create initial sensor data for the new machine
    const newSensorData = {
      machineId: id,
      sensors: {
        [`TEMP_SENSOR_${Math.floor(Math.random() * 100)}`]: [
          { parameter: "temperature", value: "72.0°C", timestamp: new Date().toISOString() }
        ]
      }
    };
    
    // Update your sensor data state - adjust this based on how you're storing sensor data
    // This is just an example assuming you have a setSensorData function
    const updatedSensorData = {...DUMMY_SENSOR_DATA};
    updatedSensorData[id] = newSensorData;
    
    // You might have a function like this or directly modify your state:
    // setSensorData(updatedSensorData);
    
    // For development/demo purposes, log the new machine
    console.log(`Added new machine: ${name} (${id})`);
  };

  return (
    <div className="flex flex-col h-full lg:flex-row lg:h-screen  bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-80 xl:w-80 flex flex-col gap-6 h-full p-4 border-r border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#121212] shadow-sm">
        <div className="w-full flex gap-4 items-center justify-center ">
          <img className="w-[40%] h-[60%]" src={theme === "light"?"/logos/ADHVX-Logo.png":"/logos/ADHVX-WLogo (1).png"} alt="" /> 
          <h1 className="text-2xl"> | Dashboard</h1>
        </div>

        <div className="relative">
          <Input 
            placeholder="Search machines..." 
            className="pl-10 "
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto ">
          {machines.map((machine) => (
            <MachineView key={machine._id} machineId={machine._id} />
          ))}
        </div>

        <div className="flex justify-center mt-2 mb-4">
        <AddMachine onAddMachine={addNewMachine}/>
        </div>
        
      </div>
      <div className="w-full lg:w-[75%] h-full  flex flex-col gap-4  overflow-auto p-4">
        <div className="flex flex-col  items-center gap-4 md:gap-4 md:items-stretch ">
            <div className="flex items-center gap-4  justify-end ">
              <div className="items-center hidden">
                <p className="text-2xl font-medium">Dashboard</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Manage
                </button>
                <button className="px-6 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  User Management
                </button>
                <button className="p-2 rounded-full bg-card hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 md:gap-10 mb-2 overflow-x-auto  w-fit border-b-2 border-black/10 dark:border-white/10">
            {['Overall Performance', 'Statistics', 'Log Data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 md:px-0 py-2  transition-colors text-sm focus:outline-none  ${
                  selectedTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-transparent dark:bg-transparent border-b-2'
                  : 'bg-transparent dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Company Overview Card */}
        <div className="w-full ">
        <Card className="w-full shadow-sm border  ">
              <CardContent className="px-6  py-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="h-full text-left ">
                            <h3 className="text-xl font-semibold ">Company Name</h3>
                            <p className="text-lg text-red-500 dark:text-red-400 mb-3">Contact Info.</p>
                            <Button className="bg-blue-600 hover:bg-blue-700 transition-colors h-8 px-4 shadow-sm">
                              <ArrowRight size={16}/>
                            </Button>
                    </div>
                    <div className="flex gap-8 w-1/4 items-center justify-center self-center " style={{width:200,height:150}}>
                        {/* First Progress Bar */}
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20">
                            <CircularProgressbar 
                              value={95} 
                              text={`${95}%`}
                              styles={buildStyles({
                                textSize: '22px',
                                pathColor: '#4ade80',
                                trailColor : isDark?"#151515":"#e6e6e6",
                                textColor :isDark?"#cdcdcd":"#333",
                                backgroundColor: '#fff',
                                pathTransitionDuration: 0.5,
                              })}
                            />
                          </div>
                          <div className="text-center mt-2">
                            <p className="text-xs text-green-500 font-medium">Excellent</p>
                            <p className="text-xs text-gray-500">Overall</p>
                          </div>
                        </div>

                        {/* Second Progress Bar */}
                        <div className="flex flex-col items-center ">
                          <div className="w-20 h-20">
                            <CircularProgressbar 
                              value={45} 
                              text={`${45}%`}
                              styles={buildStyles({
                                textSize: '22px',
                                pathColor: '#4ade80',
                                trailColor :isDark?"#151515":"#e6e6e6",
                                textColor :isDark?"#cdcdcd":"#333",
                                backgroundColor: '#fff',
                                pathTransitionDuration: 0.5,
                              })}
                            />
                          </div>
                          <div className="text-center mt-2">
                            <p className="text-xs text-green-500 font-medium">Excellent</p>
                            <p className="text-xs text-gray-500">Current Month</p>
                          </div>
                        </div>
      
                    </div>
                    <div className="flex flex-row md:flex-row gap-6 md:gap-8 items-start w-full md:w-1/2 justify-around">
                      <div className="text-left flex flex-col items-start gap-2 w-full md:w-1/3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                          <ClipboardCheck className="text-blue-600 dark:text-blue-400" size={18}/>
                        </div>
                        <p className="text-xl font-medium text-blue-600 dark:text-blue-400">$5.3k</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Open Work Orders</p>
                      </div>
                      
                      <div className="text-left flex flex-col items-start gap-2 w-full md:w-1/3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                          <CheckCircle className="text-red-600 dark:text-red-400" size={18}/>
                        </div>
                        <p className="text-xl font-medium text-red-600 dark:text-red-400">$25k</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed Work Orders</p>
                      </div>
                      
                      <div className="text-left flex flex-col items-start gap-2 w-full md:w-1/3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                          <MessageCircle className="text-purple-600 dark:text-purple-400" size={18}/>
                        </div>
                        <p className="text-xl font-medium text-purple-600 dark:text-purple-400">$8k</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Service Requests</p>
                      </div>
                    </div>
                </div>

              </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2 md:grid  md:grid-cols-2 lg:grid-cols-4 md:gap-4 auto-rows-min grid-flow-dense ">

          <MetricCard
              title="Run Time"
              value={75}
              text="18h"
              pathColor="#3066BE"
              Icon={<Clock className="w-5 h-5 text-blue-600" />}
              isDark={isDark}
            />
          <MetricCard
              title="Down Time"
              value={8}
              text="2.5h"
              pathColor="#963484"
              Icon={<Timer className="w-5 h-5 text-purple-600"/>}
              isDark={isDark}

              />
          <MetricCard
              title="Efficiency"
              value={82}
              text="82%"
              pathColor="#2AF4FF"
              Icon={<Zap className="w-5 h-5 text-cyan-600"/>}
              isDark={isDark}

              />
              
          {/* Alerts */}
          <div className="row-span-2">
            <Card className="h-full"> {/* Changed from bg-red-500 */}
              <CardContent className="h-full py-4"> {/* Added h-full */}
                <div className="flex flex-col h-full"> {/* Added flex-col and h-full */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Alerts</h3>
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="space-y-4 flex-grow "> {/* Added flex-grow */}
                    {DUMMY_ALERTS.slice(0, 3).map((alert, index) => (
                      <div key={index} className="flex items-center gap-4 text-left">
                        {alert.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <MetricCard
              title="Total Energy"
              value={40}
              text="450.3 kwh"
              pathColor="#F6CC0D"
              Icon={<Zap className="w-5 h-5 text-cyan-600"/>}
              isDark={isDark}

              
              />
          <Card className="col-span-2 shadow-sm border ">
          <CardHeader className="pt-4 pb-0">
                  <CardTitle>Total Consumables</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-0 ">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="text-left py-2 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Description</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500 dark:text-gray-400  text-sm">Quantity</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500 dark:text-gray-400  text-sm">Description</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-500 dark:text-gray-400  text-sm">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">Coolant</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">20L</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">Resin</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">5Kgs</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">Brass Wire</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">8 Units</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">Filters</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300  text-sm">12 Units</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <MachinePerformance isDark={isDark} />
            

        </div>               
        </div>
    </div>
  );
};
interface MetricCardProps {
  title: string;
  value: number;
  text: string;
  pathColor: string;
  Icon: React.ReactNode;
  trailColor?: string;
  textColor?: string;
  textSize?: string;
  animationDuration?: number;
  isDark?:boolean
}

  
const MetricCard: React.FC<MetricCardProps> = ({
  isDark,
  title,
  Icon,
  value,
  text,
  pathColor,
  trailColor = isDark?"#151515":"#e6e6e6",
  textColor = isDark?"#cdcdcd":"#333",
  textSize = "17px",
  animationDuration = 0.5
}) =>{
  return(
    <Card className="h-full shadow-sm border ">
    <CardContent className="py-4  h-full flex flex-col justify-around ">
    <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">{title}</h3>
          {Icon}
        </div>
        <div className="w-20 h-20 lg:w-[100px] lg:h-[100px] flex mx-auto font-medium">
          <CircularProgressbar
            value={value}
            text={text}
            styles={buildStyles({
              textSize: textSize,
              pathColor: pathColor,
              textColor: textColor,
              trailColor: trailColor,
              backgroundColor: '#fff',
              pathTransitionDuration: animationDuration,
              
            })}
          />
        </div>
    </CardContent>
  </Card>
  )
}

interface MachineViewProps {
  machineId: string;
}

const MachineView = ({ machineId }: MachineViewProps) => {
  const [data, setData] = useState(DUMMY_SENSOR_DATA[machineId]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        sensors: Object.fromEntries(
          Object.entries(prev.sensors).map(([key, val]) => [
            key,
            val.map(sensor => ({
              ...sensor,
              value: updateSensorValue(sensor.value)
            }))
          ])
        )
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-left flex items-center gap-2">
          <CpuIcon className="h-5 w-5" />
          {data.machineId}
        </CardTitle>
        <CardDescription className="text-left flex items-center gap-2">
          Active Sensors: {Object.keys(data.sensors || {}).length}
        </CardDescription>
      </CardHeader>
      {/* <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(data.sensors || {}).map(([key, val]) => (
          <SensorView key={key} name={key} data={val} />
        ))}
      </CardContent> */}
    </Card>
  );
};

interface SensorViewProps {
  data: any[];
  name: string;
}

const SensorView = ({ data, name }: SensorViewProps) => {
  return (
    <Card className="border hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-left flex items-center gap-2 text-lg">
          <CircuitBoardIcon className="h-5 w-5" />
          {name}
        </CardTitle>
        <CardDescription className="text-left space-y-2">
          {data.map((sensorData, index) => (
            <p key={index} className="text-sm font-medium flex justify-between">
              <span className="text-gray-500">{sensorData.parameter.toUpperCase()}:</span>
              <span className="text-gray-900 dark:text-gray-100">{sensorData.value}</span>
            </p>
          ))}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const MachinePerformance = ({ isDark = false }) => {
  const performanceData = Array.from({ length: 12 }, (_, i) => ({
    name: `Month ${i + 1}`,
    value: 40 + Math.random() * 40
  }));
  
  const [selectedParameter, setSelectedParameter] = useState('Machine Performance');

  return(
    <Card className="col-span-4 shadow-sm border">
  <CardContent className="pt-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
     <div className="flex items-center gap-4">
        <h3 className="text-base font-semibold">Machine Performance - Monthly Analytics</h3>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
      <span className="text-sm text-gray-500">Parameter:</span>
        <Select value={selectedParameter} onValueChange={setSelectedParameter}>
        <SelectTrigger className="w-full md:w-[200px] ">
          <SelectValue>{selectedParameter}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Efficiency">Efficiency</SelectItem>
              <SelectItem value="Down Time">Down Time</SelectItem>
              <SelectItem value="Machine Performance">Machine Performance</SelectItem>
              <SelectItem value="Maintenance Log">Maintenance Log</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Performance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
  )
}
// Helper function to simulate changing values
function updateSensorValue(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  const variation = (Math.random() - 0.5) * 2;
  const newValue = (num + variation).toFixed(1);
  
  if (value.includes('°C')) return `${newValue}°C`;
  if (value.includes('hPa')) return `${newValue} hPa`;
  if (value.includes('L/min')) return `${newValue} L/min`;
  if (value.includes('bar')) return `${newValue} bar`;
  return value;
}

export default Dashboard;