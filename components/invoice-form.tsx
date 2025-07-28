"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Upload, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Invoice, InvoiceItem } from "@/types/invoice"

interface InvoiceFormProps {
  onPreview: (invoice: Invoice) => void
  user: any
  initialInvoice?: Invoice
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
]

export function InvoiceForm({ onPreview, user, initialInvoice }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>({
    id: "",
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    sender: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    recipient: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    shipping: 0,
    total: 0,
    currency: "USD",
    notes: "",
    terms: "",
    logo: null,
    status: "draft",
  })

  const supabase = createClient()

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice)
    } else {
      // Generate invoice number
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
      setInvoice((prev) => ({ ...prev, invoiceNumber }))
    }
  }, [initialInvoice])

  useEffect(() => {
    calculateTotals()
  }, [invoice.items, invoice.taxRate, invoice.discountRate, invoice.shipping])

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = (subtotal * invoice.taxRate) / 100
    const discountAmount = (subtotal * invoice.discountRate) / 100
    const total = subtotal + taxAmount - discountAmount + invoice.shipping

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      discountAmount,
      total,
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items]
    newItems[index] = { ...newItems[index], [field]: value }

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setInvoice((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0, amount: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    if (invoice.items.length > 1) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoice((prev) => ({ ...prev, logo: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const saveInvoice = async () => {
    if (!user) {
      // Save to localStorage
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const invoiceToSave = { ...invoice, id: Date.now().toString() }
      savedInvoices.push(invoiceToSave)
      localStorage.setItem("invoices", JSON.stringify(savedInvoices))
      return
    }

    try {
      const { error } = await supabase.from("invoices").upsert({
        id: invoice.id || undefined,
        user_id: user.id,
        invoice_data: invoice,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error saving invoice:", error)
    }
  }

  const handlePreview = () => {
    saveInvoice()
    onPreview(invoice)
  }

  const selectedCurrency = currencies.find((c) => c.code === invoice.currency)

  return (
    <div className="space-y-6">
      {/* Template Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo">Business Logo</Label>
              <div className="mt-1">
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <Button variant="outline" onClick={() => document.getElementById("logo")?.click()} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
              {invoice.logo && (
                <div className="mt-2">
                  <img src={invoice.logo || "/placeholder.svg"} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={invoice.currency}
                onValueChange={(value) => setInvoice((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={invoice.date}
                onChange={(e) => setInvoice((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sender & Recipient */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From (Your Business)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="senderName">Business Name</Label>
              <Input
                id="senderName"
                value={invoice.sender.name}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    sender: { ...prev.sender, name: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="senderEmail">Email</Label>
              <Input
                id="senderEmail"
                type="email"
                value={invoice.sender.email}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    sender: { ...prev.sender, email: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="senderPhone">Phone</Label>
              <Input
                id="senderPhone"
                value={invoice.sender.phone}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    sender: { ...prev.sender, phone: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="senderAddress">Address</Label>
              <Textarea
                id="senderAddress"
                value={invoice.sender.address}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    sender: { ...prev.sender, address: e.target.value },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To (Client)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipientName">Client Name</Label>
              <Input
                id="recipientName"
                value={invoice.recipient.name}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, name: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="recipientEmail">Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={invoice.recipient.email}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, email: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="recipientPhone">Phone</Label>
              <Input
                id="recipientPhone"
                value={invoice.recipient.phone}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, phone: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="recipientAddress">Address</Label>
              <Textarea
                id="recipientAddress"
                value={invoice.recipient.address}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    recipient: { ...prev.recipient, address: e.target.value },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label>Rate ({selectedCurrency?.symbol})</Label>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <Label>Amount</Label>
                  <div className="text-lg font-medium py-2">
                    {selectedCurrency?.symbol}
                    {item.amount.toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={invoice.items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addItem} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoice.taxRate}
                onChange={(e) => setInvoice((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                value={invoice.discountRate}
                onChange={(e) =>
                  setInvoice((prev) => ({ ...prev, discountRate: Number.parseFloat(e.target.value) || 0 }))
                }
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="shipping">Shipping ({selectedCurrency?.symbol})</Label>
              <Input
                id="shipping"
                type="number"
                value={invoice.shipping}
                onChange={(e) => setInvoice((prev) => ({ ...prev, shipping: Number.parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {selectedCurrency?.symbol}
                {invoice.subtotal.toFixed(2)}
              </span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>
                  {selectedCurrency?.symbol}
                  {invoice.taxAmount.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount ({invoice.discountRate}%):</span>
                <span>
                  -{selectedCurrency?.symbol}
                  {invoice.discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            {invoice.shipping > 0 && (
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {selectedCurrency?.symbol}
                  {invoice.shipping.toFixed(2)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>
                {selectedCurrency?.symbol}
                {invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoice.notes}
              onChange={(e) => setInvoice((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or information"
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoice.terms}
              onChange={(e) => setInvoice((prev) => ({ ...prev, terms: e.target.value }))}
              placeholder="Payment terms and conditions"
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handlePreview} size="lg">
          <Eye className="h-4 w-4 mr-2" />
          Preview Invoice
        </Button>
      </div>
    </div>
  )
}
