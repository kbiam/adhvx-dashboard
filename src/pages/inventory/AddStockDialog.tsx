import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { InventoryItem } from './index'

interface AddStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: Omit<InventoryItem, 'id' | 'serialNo'>) => void
  categories: string[]
}

const AddStockDialog = ({ open, onOpenChange, onSave, categories }: AddStockDialogProps) => {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    category: '',
    notes: '',
    stock: 0,
    status: 'In Stock' as InventoryItem['status']
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value
    }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required'
    }
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Determine status based on stock level
      let status: InventoryItem['status'] = 'In Stock'
      if (formData.stock === 0) {
        status = 'Back Ordered'
      } else if (formData.stock <= 5) {
        status = 'Low Stock'
      }
      
      onSave({
        ...formData,
        status
      })
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Stock Item</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="PRD-XXX"
              />
              {errors.productId && (
                <p className="text-xs text-red-500">{errors.productId}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                min={0}
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Product name"
            />
            {errors.productName && (
              <p className="text-xs text-red-500">{errors.productName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger>
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
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information about the product"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className='w-full sm:w-auto order-1 sm:order-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed'>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddStockDialog