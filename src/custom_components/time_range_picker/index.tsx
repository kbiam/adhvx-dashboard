import { useState } from "react";
import { addHours, formatISO, startOfDay, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, TimerIcon } from "lucide-react";
import { isEmpty } from "@/utils";

export interface DateTimeRange {
  Start: string;
  End: string;
  Label?: string;
}

const getDefaultCustomDateRange = () => [
  formatISO(startOfDay(subDays(new Date(), 2))),
  formatISO(startOfDay(new Date())),
];

interface DateTimePickerProps {
  value: DateTimeRange | null;
  onChange: (range: DateTimeRange) => void;
}

export const DateTimePicker = ({
  value,
  onChange = () => {},
}: DateTimePickerProps) => {
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customStart, setCustomStart] = useState<string>(
    getDefaultCustomDateRange()[0]
  );
  const [customEnd, setCustomEnd] = useState<string>(
    getDefaultCustomDateRange()[1]
  );
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const handlePreset = (hours: number) => {
    const end = new Date();
    const start = addHours(end, -hours);
    onChange({
      Start: formatISO(start),
      End: formatISO(end),
      Label: hours > 1 ? `Last ${hours} Hours` : `Last ${hours} Hour`,
    });
    setIsPopoverOpen(false);
  };

  const formatDateTime = (date: Date, time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const updatedDate = new Date(date);
    updatedDate.setHours(hour, minute);
    return formatISO(updatedDate);
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      onChange({ Start: customStart, End: customEnd });
      setIsCustomRangeOpen(false);
      setIsPopoverOpen(false);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const labelRenderer = (value: DateTimeRange | null) => {
    if (!value || isEmpty(value) || !value.End || !value.Start) {
      return "Select Date Range";
    }
    if (value.Label) {
      return value.Label;
    }
    return `${value.Start} - ${value.End}`;
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between">
            <TimerIcon size={16} className="mr-2" />
            <span className="text-ellipsis whitespace-nowrap overflow-hidden">
              {labelRenderer(value)}
            </span>
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-4">
          <div className="flex flex-col gap-2">
            <Button onClick={() => handlePreset(1)} variant="outline">
              Last 1 Hour
            </Button>
            <Button onClick={() => handlePreset(24)} variant="outline">
              Last 24 Hours
            </Button>
            <Dialog
              open={isCustomRangeOpen}
              onOpenChange={setIsCustomRangeOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsCustomRangeOpen(true)}
                >
                  Custom Range
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Select Custom Date-Time Range</DialogTitle>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex w-full gap-4">
                    <div className="flex flex-col w-full gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Input
                            value={customStart ? customStart.slice(0, 10) : ""}
                            placeholder="Select start date"
                            readOnly
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              customStart ? new Date(customStart) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                setCustomStart(formatDateTime(date, startTime));
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex w-full gap-4">
                    <div className="flex flex-col w-full gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Input
                            value={customEnd ? customEnd.slice(0, 10) : ""}
                            placeholder="Select end date"
                            readOnly
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={
                              customEnd ? new Date(customEnd) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                setCustomEnd(formatDateTime(date, endTime));
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCustomRange}>
                    Apply Custom Range
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
