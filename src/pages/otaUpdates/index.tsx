import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  Upload, 
  RefreshCcw,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

const OTAUpdates = () => {
  const [updateType, setUpdateType] = useState("firmware");
  const [deviceID, setDeviceID] = useState("00:00:5E:00:53:AF");
  const [boardType, setBoardType] = useState("GTWY-ADHVX");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast.success(`${updateType.charAt(0).toUpperCase() + updateType.slice(1)} updated successfully!`);
      setIsUploading(false);
      setFile(null);
    }, 2000);
  };

  const refresh = () => {
    setFile(null);
    toast.info("Refreshed");
  };

  return (
    <div className="p-4 sm:p-4 md:py-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-semibold">
            OTA Updates
          </h1>
        </div>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </Button>
        </div>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Update Device Firmware</CardTitle>
          <CardDescription>
            Upload firmware or filesystem updates to your devices wirelessly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Update Type Selection */}
          <div className="space-y-3 flex flex-col items-center">
            <RadioGroup 
              defaultValue="firmware" 
              className="flex gap-6" 
              value={updateType}
              onValueChange={setUpdateType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="firmware" id="firmware" />
                <Label htmlFor="firmware">Firmware</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filesystem" id="filesystem" />
                <Label htmlFor="filesystem">Filesystem</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Device Information */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="deviceID">Device ID</Label>
              <Input 
                id="deviceID" 
                value={deviceID} 
                onChange={(e) => setDeviceID(e.target.value)}
                className=""
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="boardType">Board Type</Label>
              <Input 
                id="boardType" 
                value={boardType} 
                onChange={(e) => setBoardType(e.target.value)}
                className=""
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mt-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer
                ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-primary-foreground"}
                ${file ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".bin,.hex,.ino,.spiffs"
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-2" />
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Drag and Drop to Upload</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or click to browse files</p>
                </>
              )}
            </div>
          </div>

          {/* Device Info Pills */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <div className="px-4 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm font-medium">
              {deviceID}
            </div>
            <div className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
              {boardType}
            </div>
          </div>

          {/* Upload Button */}
          <Button 
            className="w-full mt-6 bg-mainBlue hover:bg-blue-700 text-white "
            disabled={!file || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> 
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> 
                Upload {updateType.charAt(0).toUpperCase() + updateType.slice(1)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTAUpdates;