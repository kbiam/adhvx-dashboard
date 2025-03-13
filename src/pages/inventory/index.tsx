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
  Pencil,
  FileText
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { USER_ROLES, USER_ROLE_MAPPING } from "@/constants"
import { getCurrentUserRole } from "@/utils/auth"
import AddStockDialog from './AddStockDialog'
import EditStockDialog from './EditStockDialog'

// Define the Inventory Item type
export type InventoryItem = {
  id: string
  serialNo: string
  productId: string
  productName: string
  category: string
  notes: string
  stock: number
  status: "In Stock" | "Back Ordered" | "Low Stock"
}

// Define status options for filtering
const STATUS_OPTIONS = [
  "In Stock",
  "Back Ordered",
  "Low Stock"
]

// Define category options for filtering
const CATEGORY_OPTIONS = [
  "Electronics",
  "Hardware",
  "Software",
  "Peripherals",
  "Networking",
  "Storage"
]

const Inventory = () => {
  // Get current user role
  const userRole = getCurrentUserRole()
  let isAdmin = userRole >= USER_ROLE_MAPPING[USER_ROLES.ADMIN]
  isAdmin = true
  
  // Initial data
  const [data, setData] = useState<InventoryItem[]>([
    {
      id: "1",
      serialNo: "SN001",
      productId: "PRD-001",
      productName: "Raspberry Pi 4",
      category: "Electronics",
      notes: "Used for IoT projects",
      stock: 25,
      status: "In Stock"
    },
    {
      id: "2",
      serialNo: "SN002",
      productId: "PRD-002",
      productName: "Arduino Uno",
      category: "Electronics",
      notes: "Entry level microcontroller",
      stock: 15,
      status: "In Stock"
    },
    {
      id: "3",
      serialNo: "SN003",
      productId: "PRD-003",
      productName: "Ethernet Cable",
      category: "Networking",
      notes: "Cat 6, 3m length",
      stock: 0,
      status: "Back Ordered"
    },
    {
      id: "4",
      serialNo: "SN004",
      productId: "PRD-004",
      productName: "USB Hub",
      category: "Peripherals",
      notes: "4-port USB 3.0",
      stock: 3,
      status: "Low Stock"
    }
  ])

  // State for table
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  
  // State for filters
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Function to handle edit action
  const handleEdit = (item: InventoryItem) => {
    if (!isAdmin) return
    setCurrentItem(item)
    setEditDialogOpen(true)
  }
  
  // Function to save edited item
  const handleSaveEdit = (updatedItem: InventoryItem) => {
    setData(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
    setEditDialogOpen(false)
  }
  
  // Function to handle delete action
  const handleDelete = (itemId: string) => {
    if (!isAdmin) return
    setData(prev => prev.filter(item => item.id !== itemId))
  }
  
  // Function to add new stock
  const handleAddStock = (newItem: InventoryItem) => {
    // Generate a new ID (in a real app this would be done server-side)
    const newId = (parseInt(data[data.length - 1]?.id || "0") + 1).toString()
    const newSerialNo = `SN${newId.padStart(3, '0')}`
    
    setData(prev => [...prev, { ...newItem, id: newId, serialNo: newSerialNo }])
    setAddDialogOpen(false)
  }
  
  // Memoized filtered data based on status and category
  const filteredData = useMemo(() => {
    let filtered = data
    
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(item => selectedStatuses.includes(item.status))
    }
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category))
    }
    
    return filtered
  }, [data, selectedStatuses, selectedCategories])

  // Columns definition
  const columns: ColumnDef<InventoryItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center space-x-2">
          <CustomCheckbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
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
            variant="primary"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "serialNo",
      header: ({ column }) => (
        <div className='flex items-center justify-start'>
          <Button
            variant="outline"
            className='hover:bg-transparent bg-transparent border-none pl-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Serial No
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="flex justify-start">{row.getValue("serialNo")}</div>,
    },
    {
      accessorKey: "productId",
      header: "Product ID",
      cell: ({ row }) => <div className="flex justify-start">{row.getValue("productId")}</div>,
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <div className='flex items-center justify-start'>
          <Button
            variant="outline"
            className='hover:bg-transparent bg-transparent border-none pl-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="flex justify-start">{row.getValue("productName")}</div>,
    },
    {
      accessorKey: "category",
      header: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className='flex items-center justify-center hover:cursor-pointer'>
              Category 
              <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORY_OPTIONS.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories([...selectedCategories, category])
                  } else {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category)
                    )
                  }
                }}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedCategories.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedCategories([])
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <div className="flex justify-start">{row.getValue("notes")}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <div className='flex items-center justify-start'>
          <Button
            variant="outline"
            className='hover:bg-transparent bg-transparent border-none pl-0'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stock (Qty)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="flex justify-start">{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "status",
      header: () => (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <span className='flex items-center justify-start hover:cursor-pointer '>
              Status 
              <ChevronDown className="ml-2 h-4 w-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStatuses([...selectedStatuses, status])
                  } else {
                    setSelectedStatuses(
                      selectedStatuses.filter((s) => s !== status)
                    )
                  }
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedStatuses.length > 0 && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault()
                  setSelectedStatuses([])
                }}
                className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) => {
        const status = String(row.getValue("status"))
        
        const statusColors: Record<string, string> = {
          "In Stock": "bg-green-100 text-green-700",
          "Back Ordered": "bg-red-100 text-red-700",
          "Low Stock": "bg-orange-100 text-orange-700",
        }
        
        const bgColor = statusColors[status] || "bg-gray-100 text-gray-600"
        
        return (
          <div className='flex'>
            <span className={`px-2 py-1 ${bgColor} rounded-full text-xs`}>
              {status}
            </span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original
        
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
              {isAdmin && (
                <DropdownMenuItem 
                  onClick={() => handleEdit(item)}
                  className="flex items-center cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="flex items-center cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem 
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center cursor-pointer text-red-600 hover:!bg-red-50 focus:!bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Create table instance
  const table = useReactTable({
    data: filteredData,
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

  const refresh = () => {
    console.log("Refreshed")
    // In a real application, this would fetch updated data from the server
  }

  return (
    <div className="p-4 sm:p-4 md:py-6  min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-semibold">
            Inventory Management
          </h1>
          <Star className='w-4 h-4 cursor-pointer'/>
          <RefreshCcw className='w-4 h-4 hover:cursor-pointer' onClick={refresh} />
        </div>
        
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" /> Help
          </Button>
          {isAdmin && (
            <Button 
              variant="default" 
              className="flex items-center bg-mainBlue hover:bg-blue-700 dark:text-white"
              onClick={() => setAddDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Stock
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg p-2">
        {/* Search Input */}
        <div className="flex items-center py-4 px-2">
          <Input
            placeholder="Search products..."
            value={(table.getColumn("productName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("productName")?.setFilterValue(event.target.value)
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
                    <TableHead key={header.id}>
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
        <div className="flex items-center justify-between space-x-2 p-4">
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
              {table.getFilteredRowModel().rows.length} total items
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
      
      {/* Add Stock Dialog (to be implemented) */}
      {isAdmin && addDialogOpen && (
        <AddStockDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={handleAddStock}
          categories={CATEGORY_OPTIONS}
        />
      )}
      
      {/* Edit Stock Dialog (to be implemented) */}
      {isAdmin && editDialogOpen && currentItem && (
        <EditStockDialog
          open={editDialogOpen}
          item={currentItem}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveEdit}
          categories={CATEGORY_OPTIONS}
        />
      )}
    </div>
  )
}

export default Inventory