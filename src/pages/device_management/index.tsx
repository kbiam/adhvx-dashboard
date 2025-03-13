import React, { useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import CustomCheckbox from '@/custom_components/checkbox'
import { 
  HelpCircle, 
  PlusCircle,
  ArrowUpDown,
  MoreHorizontal,
  Star,
  RefreshCcw,
  ChevronDown,
  Trash2,
  Pencil
} from "lucide-react"
import { Input } from "@/components/ui/input"
import AddDevice from './AddDevice'
import AutoConfig from './AutoConfig'
import EditDeviceDialog from './EditDeviceDialog'


// Define the Device type
export type Device = {
  id: string,
  image:string
  name: string
  connectionStatus: string
  product: string
  locatedAt: string
  status: string
  type: string
  connectivity: string
}

// Define connection status options
const CONNECTION_STATUS_OPTIONS = [
    "Registered",
    "Unregistered",
    "Connected",
    "Disconnected",
    "Pending"
  ]

const DeviceManagement = () => {
  // Initial data
  const [data, setData] = useState<Device[]>([
    {
      id: "1",
      image:"",
      name: "dvdv",
      connectionStatus: "Registered",
      product: "PR58-1 MQTT 2001",
      locatedAt: "-",
      status: "Active",
      type: "Smart Sensor",
      connectivity: "MQTT"
    },
    {
      id: "2",
      image:"",
      name: "sensor2",
      connectionStatus: "Connected",
      product: "PR58-2 MQTT 2002",
      locatedAt: "Room A",
      status: "Active",
      type: "Smart Sensor",
      connectivity: "WiFi"
    },
    {
      id: "3",
      image:"",
      name: "device3",
      connectionStatus: "Disconnected",
      product: "PR58-3 MQTT 2003",
      locatedAt: "Room B",
      status: "Inactive",
      type: "Gateway",
      connectivity: "Ethernet"
    }
  ])

  // State for table
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [currentDevice, setCurrentDevice] = useState<Device | null>(null)

    // Function to handle edit action
  const handleEdit = (device: Device) => {
    console.log(device)
    setCurrentDevice(device)
    setEditDialogOpen(true)
  }
    // Function to save edited device
    const handleSaveEdit = (updatedDevice: Device) => {
        console.log(updatedDevice)
        setEditDialogOpen(false)
      }

  // State for connection status filter
const [selectedConnectionStatuses, setSelectedConnectionStatuses] = useState<string[]>([])

  // Memoized filtered data based on connection status
  const filteredData = useMemo(() => {
    return selectedConnectionStatuses.length > 0
      ? data.filter(device => selectedConnectionStatuses.includes(device.connectionStatus))
      : data
  }, [data, selectedConnectionStatuses])

  // Columns definition
  const columns: ColumnDef<Device>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center space-x-2">
            <CustomCheckbox
            
              checked={
                table.getIsAllPageRowsSelected() 
                // ||(table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className=""
              variant='primary'
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <CustomCheckbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className=""
              variant="primary"

            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "image",
        header: "Device Image",
        cell: ({ row }) => <div className='flex'>{row.getValue("image")}</div>,
      },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className=' flex items-center justify-start '>
        <Button
        variant={"outline"}
            className='hover:bg-transparent bg-transparent border-none pl-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        </div>
      ),
      cell: ({ row }) => <div className="lowercase flex justify-start items-center ">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "connectionStatus",
        header: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className='flex items-center justify-center hover:cursor-pointer'>
                Connection Status 
                <ChevronDown className="ml-2 h-4 w-4" />
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter Connection Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CONNECTION_STATUS_OPTIONS.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedConnectionStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedConnectionStatuses([...selectedConnectionStatuses, status])
                    } else {
                      setSelectedConnectionStatuses(
                        selectedConnectionStatuses.filter((s) => s !== status)
                      )
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedConnectionStatuses.length > 0 && (
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    setSelectedConnectionStatuses([])
                  }}
                  className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
                >
                  Clear Filters
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        cell: ({ row }) => <div>{row.getValue("connectionStatus")}</div>,

      },
    {
      accessorKey: "product",
      header: "UID",
      cell: ({ row }) => <div className='flex'>{row.getValue("product")}</div>,
    },
    {
      accessorKey: "locatedAt",
      header: "Located At",
      cell: ({ row }) => <div className='flex'>{row.getValue("locatedAt")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = String(row.getValue("status"));

        const statusColors: Record<string, string> = {
          Active: "bg-green-100 text-green-700",
          Inactive: "bg-red-100 text-red-700",
          Pending: "bg-orange-100 text-orange-700",

        };
        
        // Default color if status is unknown
        const bgColor = statusColors[status] || "bg-gray-100 text-gray-600";
        
        
        return(
        <div className='flex'>
        <span className={`px-2 py-1 ${bgColor} text-green-600 rounded-full text-xs`}>
          {status}
        </span>
        </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div className='flex'>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "connectivity",
      header: ()=>(
        <div className=' flex justify-center'>
Device CAN Protocol
        </div>),
      cell: ({ row }) => <div className='flex justify-center'>{row.getValue("connectivity")}</div>,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const device = row.original
          
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => handleEdit(device)}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDelete(device.id)}
                  className="flex items-center cursor-pointer text-red-600 hover:!bg-red-50 focus:!bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
    },

  ]

  // Create table instance
  const table = useReactTable({
    data:filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const refresh = ()=>{
    console.log("Refreshed")
  }

  const handleDelete = (deviceID:string)=>{
    console.log("deleted",deviceID)
  }

  return (
    <div className="p-4 sm:p-4 md:py-6   min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-semibold">
            Device Management
          </h1>
          <Star className='w-4 h-4 cursor-pointer'/>

            <RefreshCcw className='w-4 h-4 hover:cursor-pointer' onClick={refresh}  />
        </div>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </Button>
          {/* <Button variant="outline" className="flex items-center">
            Auto config
          </Button> */}
          <AutoConfig onDeviceSelect={(deviceId) => {
            console.log("Selected device:", deviceId);
            // Handle device configuration here
            }} />
          {/* <Button 
            variant="default" 
            className="flex items-center bg-mainBlue hover:bg-blue-700 dark:text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Device
          </Button> */}
          <AddDevice onClaimDevice={(deviceId) => {
            // Logic to claim the device
            console.log("Claiming device with ID:", deviceId);
            }} />
        </div>
      </div>

      {/* Table Container */}
      <div className="  bg-white dark:bg-[#1a1a1a] rounded-lg p-2">
        {/* Search Input */}
        <div className="flex items-center py-4 px-2">
          <Input
            placeholder="Search devices..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className=''>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between  space-x-2 p-4">
        <div className="flex text-xs text-muted-foreground space-x-2">
    <span>
      {table.getFilteredSelectedRowModel().rows.length} row(s) selected
    </span>
    <span className="text-gray-300">|</span>
    <span>
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </span>
    <span className="text-gray-300">|</span>
    <span>
      {table.getFilteredRowModel().rows.length} total rows
    </span>
  </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
            {/* Import the EditDeviceDialog component */}
        <EditDeviceDialog
        open={editDialogOpen}
        device={currentDevice}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default DeviceManagement