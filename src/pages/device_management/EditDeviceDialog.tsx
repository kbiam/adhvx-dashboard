import React, { useState } from 'react'
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Device } from './DeviceManagement'

// Define connection status options
const CONNECTION_STATUS_OPTIONS = [
  "Registered",
  "Unregistered",
  "Connected",
  "Disconnected",
  "Pending"
]

// Define parameters for each setting type
const SETTING_PARAMS = {
  SDO: [
    { label: "SDO Timeout (ms)", key: "sdoTimeout", defaultValue: "1000" },
    { label: "SDO Client ID", key: "sdoClientId", defaultValue: "0x600" },
    { label: "SDO Server ID", key: "sdoServerId", defaultValue: "0x580" },
    { label: "Block Transfer", key: "sdoBlockTransfer", defaultValue: "Enabled" }
  ],
  NMT: [
    { label: "Node ID", key: "nmtNodeId", defaultValue: "0x01" },
    { label: "Heartbeat Producer", key: "nmtHeartbeatProducer", defaultValue: "1000" },
    { label: "Heartbeat Consumer", key: "nmtHeartbeatConsumer", defaultValue: "2000" },
    { label: "Boot-up Behavior", key: "nmtBootBehavior", defaultValue: "Operational" },
    { label: "Error Control", key: "nmtErrorControl", defaultValue: "Heartbeat" }
  ],
  SYNC: [
    { label: "SYNC ID", key: "syncId", defaultValue: "0x80" },
    { label: "SYNC Period (μs)", key: "syncPeriod", defaultValue: "10000" },
    { label: "Sync Window Length", key: "syncWindowLength", defaultValue: "5000" },
    { label: "Overflow Counter", key: "syncOverflowCounter", defaultValue: "0" }
  ],
  EMCY: [
    { label: "EMCY COB-ID", key: "emcyCobId", defaultValue: "0x80" },
    { label: "Error Register", key: "emcyErrorRegister", defaultValue: "0x00" },
    { label: "Error Behavior", key: "emcyErrorBehavior", defaultValue: "Pre-operational" },
    { label: "Inhibit Time (ms)", key: "emcyInhibitTime", defaultValue: "100" },
    { label: "Consumer ID", key: "emcyConsumerId", defaultValue: "0x81" }
  ],
  HEARTBEAT: [
    { label: "Producer Time (ms)", key: "heartbeatProducerTime", defaultValue: "1000" },
    { label: "Consumer Time (ms)", key: "heartbeatConsumerTime", defaultValue: "2000" },
    { label: "Timeout Factor", key: "heartbeatTimeoutFactor", defaultValue: "1.5" },
    { label: "Node ID", key: "heartbeatNodeId", defaultValue: "0x01" }
  ]
}

interface EditDeviceDialogProps {
  open: boolean
  device: Device | null
  onOpenChange: (open: boolean) => void
  onSave: (device: Device) => void
}

const EditDeviceDialog = ({ 
  open, 
  device, 
  onOpenChange, 
  onSave 
}: EditDeviceDialogProps) => {
  const [editedDevice, setEditedDevice] = useState<Device | null>(device)
  const [settingsSearch, setSettingsSearch] = useState("")
  const [activeSetting, setActiveSetting] = useState("SDO")
  const [paramValues, setParamValues] = useState({})

  // Update local state when device prop changes
  React.useEffect(() => {
    setEditedDevice(device)
    
    // Initialize parameter values
    const initialParamValues = {}
    Object.keys(SETTING_PARAMS).forEach(settingType => {
      SETTING_PARAMS[settingType].forEach(param => {
        initialParamValues[param.key] = param.defaultValue
      })
    })
    setParamValues(initialParamValues)
  }, [device])

  // Handle field changes
  const handleChange = (field: keyof Device, value: string) => {
    if (editedDevice) {
      setEditedDevice({
        ...editedDevice,
        [field]: value
      })
    }
  }

  // Handle parameter value changes
  const handleParamChange = (key: string, value: string) => {
    setParamValues({
      ...paramValues,
      [key]: value
    })
  }

  // Handle save button click
  const handleSave = () => {
    if (editedDevice) {
      // Add parameters to device before saving
      const updatedDevice = {
        ...editedDevice,
        parameters: paramValues
      }
      onSave(updatedDevice)
    }
  }

  const settings = [
    "SDO", "NMT", "SYNC", "EMCY", "HEARTBEAT"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="flex flex-row justify-between items-center ">
          <DialogTitle className="text-xl font-semibold">{editedDevice?.name}</DialogTitle>
          <div className="relative w-64 mr-8">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search settings..."
              className="pl-8"
              value={settingsSearch}
              onChange={(e) => setSettingsSearch(e.target.value)}
            />
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Device Image Section */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Device Image</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center mb-4">
                  {editedDevice?.image || <PlusCircle className="h-10 w-10 text-gray-400" />}
                </div>
                <Button variant="outline" size="sm">Upload Image</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Device Settings Section */}
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Device Settings</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex justify-between gap-4">
                  <div className="flex items-start gap-2 flex-col">
                    <label className="text-sm font-medium uppercase">Process Data Object</label>
                    <label className="text-sm font-medium uppercase">Unique Device ID</label>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-col">
                    <p className="text-sm font-normal">0X1234</p>
                    <p className="text-sm font-normal">0X1234</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Button 
                      onClick={handleSave}
                      className="bg-mainBlue hover:bg-blue-700 text-white h-8"
                    >
                      Refresh
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="bg-mainBlue hover:bg-blue-700 text-white h-8"
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex flex-col gap-2">
                    {settings.map((setting) => (
                      <Button 
                        key={setting}
                        className={`h-8 text-xs w-28 ${
                          activeSetting === setting 
                            ? 'bg-mainBlue hover:bg-mainBlue dark:text-white' 
                            : 'border border-mainBlue bg-transparent text-black dark:text-white hover:bg-blue-700 hover:text-white '
                        } `}
                        onClick={() => setActiveSetting(setting)}
                      >
                        {setting}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="w-full rounded-sm border border-gray-300 p-4">
                    <h3 className="font-medium mb-4">{activeSetting} Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {SETTING_PARAMS[activeSetting].map((param) => (
                        <div key={param.key} className="flex flex-col gap-1">
                          <label className="text-sm font-medium">{param.label}</label>
                          <Input 
                            value={paramValues[param.key] || param.defaultValue}
                            onChange={(e) => handleParamChange(param.key, e.target.value)}
                            className="h-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-mainBlue hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditDeviceDialog