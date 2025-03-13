import { useEffect, useState } from "react";
import { dataService } from "@/dataservice";
import { InputDropDown } from "@/custom_components/input_dropdown";
import { RawDataViewer } from "./viewer/raw.viewer";
import {
  DateTimePicker,
  DateTimeRange,
} from "@/custom_components/time_range_picker";
import { addHours, formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { GraphDataViewer } from "./viewer/graph.viewer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sensor {
  name: string;
}

export interface Machine {
  _id: string;
  name: string;
}

export interface MachineData {
  machine_id: string;
  _measurement: number;
  _field: string;
  _value: number;
  _time: string;
}

export interface MachineListResponse {
  machines: Machine[];
}

export interface SensorData {
  sensor_id: string;
  _measurement: number;
  _field: string;
  _value: number;
  _time: string;
}

interface QueryResponse {
  data: SensorData[];
}

interface SensorListResponse {
  sensors: Sensor[];
}

interface DataPoint {
  color?: string;
  x: Date;
  y: number;
}

interface ChartDataPoint {
  color: string;
  data: DataPoint[];
  id: string;
}

export type ChartData = ChartDataPoint[];

const getDefaultDateTime = () => {
  const end = new Date();
  const start = addHours(end, -1);
  return {
    Start: formatISO(start),
    End: formatISO(end),
    Label: "Last 1 Hour",
  };
};

const formatDataForChartView = (results: SensorData[]): ChartData => {
  const dataByField: {
    [key: string]: {
      id: string;
      color: string;
      data: { x: Date; y: number }[];
    };
  } = {};

  results.forEach((row) => {
    const field = row._field;

    if (!dataByField[field]) {
      dataByField[field] = {
        id: field,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        data: [],
      };
    }

    dataByField[field].data.push({
      x: new Date(row._time), // Set x as the time from the API
      y: row._value, // Set y as the value from the API
    });
  });

  // Convert the grouped data to an array format expected by Nivo
  return Object.values(dataByField);
};

export const DataExplorer = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [viewType, setViewType] = useState("graph");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rawQueryResult, setRawQueryResult] = useState<SensorData[]>([]);
  const [graphQueryResult, setGraphQueryResult] = useState<ChartData>([]);
  const [selectedMachine, setSelectedMachine] = useState<string>("");
  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [timeRange, setTimeRange] = useState<DateTimeRange>(
    getDefaultDateTime()
  );

  useEffect(() => {
    const fetchSensors = async () => {
      if (selectedMachine) {
        const sensorData: SensorListResponse = await dataService.get(
          `/telemetry/machine/${selectedMachine}/sensor/list`
        );
        setSensors(sensorData.sensors);
      }
    };
     fetchSensors();
  }, [selectedMachine]);

  useEffect(() => {
    const fetchMachines = async () => {
      const machineData: MachineListResponse = await dataService.get(
        "/telemetry/machine/list"
      );
      setMachines(machineData.machines);
    };
    fetchMachines();
  }, []);

  async function fetchData(viewType: string) {
    try {
      setIsLoading(true);
      const response: QueryResponse = await dataService.post(
        `/telemetry/machine/${selectedMachine}/${selectedSensor}/view/${viewType}`,
        {
          ...timeRange,
        }
      );
      if (viewType === "graph") {
        setGraphQueryResult(formatDataForChartView(response.data));
      } else {
        setRawQueryResult(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 sm:p-4 md:py-6 ">
      <h1 className="text-2xl font-semibold">
            Data Explorer
          </h1>
        <div className="flex gap-2 items-center">
          <Select
            value={viewType}
            onValueChange={(value) => setViewType(value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="View type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="graph">Graph</SelectItem>
              <SelectItem value="raw">Raw</SelectItem>
            </SelectContent>
          </Select>
          <div style={{ maxWidth: "250px" }}>
            <DateTimePicker
              value={timeRange}
              onChange={(range) => setTimeRange(range)}
            />
          </div>

          <InputDropDown
            className="w-50"
            value={selectedMachine}
            placeholder="Select Machine"
            onChange={(val) => {
              setSelectedMachine(val);
              setSelectedSensor("")
            }}
            options={machines.map((machine) => ({
              value: machine.name,
              label: machine.name,
            }))}
          />
          <InputDropDown
            className="w-50"
            value={selectedSensor}
            placeholder="Select Sensor"
            onChange={(val) => setSelectedSensor(val)}
            options={sensors.map((sensor) => ({
              value: sensor.name,
              label: sensor.name,
            }))}
          />
          <Button
            disabled={!selectedMachine || !selectedSensor}
            onClick={() => fetchData(viewType)}
            size={"sm"}
          >
            {isLoading ? (
              <Loader2Icon size={16} className=" animate-spin" />
            ) : (
              <SearchIcon size={16} />
            )}
          </Button>
        </div>
      </div>
      <div className="pt-4">
        {viewType === "raw" && <RawDataViewer data={rawQueryResult} />}
        {viewType === "graph" && <GraphDataViewer data={graphQueryResult} />}
      </div>
    </div>
  );
};
