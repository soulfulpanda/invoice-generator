"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Copy, Trash2, Download, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { generatePDF } from "@/lib/pdf-generator"
import type { Invoice } from "@/types/invoice"

interface InvoiceHistoryProps {
  user: any
  onEditInvoice: (invoice: Invoice) => void
}

export function InvoiceHistory({ user, onEditInvoice }: InvoiceHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadInvoices()
  }, [user])

  const loadInvoices = async () => {
    if (!user) {
      // Load from localStorage
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      setInvoices(savedInvoices)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const invoiceData = data.map((item) => ({
        ...item.invoice_data,
        id: item.id,
      }))

      setInvoices(invoiceData)
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteInvoice = async (invoiceId: string) => {
    if (!user) {
      // Delete from localStorage
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const updatedInvoices = savedInvoices.filter((inv: Invoice) => inv.id !== invoiceId)
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)
      return
    }

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId)

      if (error) throw error

      setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId))
    } catch (error) {
      console.error("Error deleting invoice:", error)
    }
  }

  const clearAllLocalData = () => {
    if (!user && confirm("Are you sure you want to clear all local invoice data? This action cannot be undone.")) {
      localStorage.removeItem("invoices")
      setInvoices([])
    }
  }

  const changeInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    if (!user) {
      // Update in localStorage
      const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const updatedInvoices = savedInvoices.map((inv: Invoice) => 
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      )
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      setInvoices(updatedInvoices)
      return
    }

    try {
      const invoice = invoices.find(inv => inv.id === invoiceId)
      if (invoice) {
        const updatedInvoice = { ...invoice, status: newStatus }
        const { error } = await supabase.from("invoices").update({
          invoice_data: updatedInvoice
        }).eq("id", invoiceId)

        if (error) throw error

        setInvoices((prev) => prev.map(inv => 
          inv.id === invoiceId ? updatedInvoice : inv
        ))
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
    }
  }

  const duplicateInvoice = (invoice: Invoice) => {
    const duplicatedInvoice = {
      ...invoice,
      id: "",
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      status: "draft",
    }
    onEditInvoice(duplicatedInvoice)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "CAD", symbol: "C$" },
    { code: "AUD", symbol: "A$" },
    { code: "JPY", symbol: "¥" },
  ]

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No invoices found.</p>
          <p className="text-sm text-gray-400">Create your first invoice to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {!user && invoices.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Local Storage</p>
                <p className="text-xs">Your invoices are stored locally. They will be lost if you clear browser data.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllLocalData}
                className="text-red-600 hover:text-red-700"
              >
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice History</h2>
        <p className="text-gray-600">
          {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => {
          const currency = currencies.find((c) => c.code === invoice.currency)
          return (
            <Card key={invoice.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg">#{invoice.invoiceNumber}</h3>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </div>
                    <p className="text-gray-600">{invoice.recipient.name}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>Date: {new Date(invoice.date).toLocaleDateString()}</span>
                      {invoice.dueDate && <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {currency?.symbol}
                      {invoice.total.toFixed(2)}
                    </p>
                    <div className="flex space-x-1 mt-3">
                      <Button variant="outline" size="sm" onClick={() => onEditInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => duplicateInvoice(invoice)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => generatePDF(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status !== "paid" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => changeInvoiceStatus(invoice.id, "paid")}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Paid</span>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => deleteInvoice(invoice.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
