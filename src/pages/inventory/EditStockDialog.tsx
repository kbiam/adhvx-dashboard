import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { InventoryItem } from './index'

interface EditStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: InventoryItem) => void
  item: InventoryItem
  categories: string[]
}

const EditStockDialog = ({
  open,
  onOpenChange,
  onSave,
  item,
  categories
}: EditStockDialogProps) => {
  // Form state for the edited item
  const [editedItem, setEditedItem] = useState<InventoryItem>({...item})
  
  // Reset form when dialog opens with a new item
  useEffect(() => {
    setEditedItem({...item})
  }, [item])
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedItem(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedItem(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
  }
  
  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setEditedItem(prev => ({ ...prev, category: value }))
  }
  
  // Handle status selection
  const handleStatusChange = (value: string) => {
    setEditedItem(prev => ({ ...prev, status: value as "In Stock" | "Back Ordered" | "Low Stock" }))
  }
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedItem)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Stock Item</DialogTitle>
            <DialogDescription>
              Update the details for this inventory item.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Product ID */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product ID
              </Label>
              <Input
                id="productId"
                name="productId"
                value={editedItem.productId}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Product Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productName" className="text-right">
                Product Name
              </Label>
              <Input
                id="productName"
                name="productName"
                value={editedItem.productName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                name="category" 
                value={editedItem.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Notes */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={editedItem.notes}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            {/* Stock Quantity */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock (Qty)
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={editedItem.stock}
                onChange={handleNumberChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                value={editedItem.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Back Ordered">Back Ordered</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className='w-full sm:w-auto order-1 sm:order-2 bg-mainBlue text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed'>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditStockDialog