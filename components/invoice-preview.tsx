"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Palette } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import type { Invoice } from "@/types/invoice"

interface InvoicePreviewProps {
  invoice: Invoice
  onBack: () => void
  user: any
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
]

const designs = [
  { id: "minimal", name: "Minimal", colors: "bg-white text-gray-900", description: "Clean and simple" },
  { id: "modern", name: "Modern", colors: "bg-blue-50 text-blue-900", description: "Professional blue theme" },
  { id: "elegant", name: "Elegant", colors: "bg-purple-50 text-purple-900", description: "Sophisticated purple" },
  { id: "vibrant", name: "Vibrant", colors: "bg-red-50 text-red-900", description: "Bold and energetic" },
  { id: "corporate", name: "Corporate", colors: "bg-slate-50 text-slate-900", description: "Professional gray" },
  { id: "creative", name: "Creative", colors: "bg-emerald-50 text-emerald-900", description: "Fresh green theme" },
]

export function InvoicePreview({ invoice, onBack, user }: InvoicePreviewProps) {
  const [selectedDesign, setSelectedDesign] = useState("minimal")
  const selectedCurrency = currencies.find((c) => c.code === invoice.currency)
  const currentDesign = designs.find((d) => d.id === selectedDesign) || designs[0]

  const handleDownloadPDF = () => {
    generatePDF(invoice, selectedDesign)
  }

  const getDesignClasses = () => {
    switch (selectedDesign) {
      case "modern":
        return {
          container: "bg-blue-50",
          card: "bg-white border-blue-200",
          title: "text-blue-900",
          text: "text-blue-800",
          secondary: "text-blue-600",
          accent: "bg-blue-100",
        }
      case "elegant":
        return {
          container: "bg-purple-50",
          card: "bg-white border-purple-200",
          title: "text-purple-900",
          text: "text-purple-800",
          secondary: "text-purple-600",
          accent: "bg-purple-100",
        }
      case "vibrant":
        return {
          container: "bg-red-50",
          card: "bg-white border-red-200",
          title: "text-red-900",
          text: "text-red-800",
          secondary: "text-red-600",
          accent: "bg-red-100",
        }
      case "corporate":
        return {
          container: "bg-slate-50",
          card: "bg-white border-slate-200",
          title: "text-slate-900",
          text: "text-slate-800",
          secondary: "text-slate-600",
          accent: "bg-slate-100",
        }
      case "creative":
        return {
          container: "bg-emerald-50",
          card: "bg-white border-emerald-200",
          title: "text-emerald-900",
          text: "text-emerald-800",
          secondary: "text-emerald-600",
          accent: "bg-emerald-100",
        }
      default:
        return {
          container: "bg-gray-50",
          card: "bg-white border-gray-200",
          title: "text-gray-900",
          text: "text-gray-900",
          secondary: "text-gray-600",
          accent: "bg-gray-100",
        }
    }
  }

  const designClasses = getDesignClasses()

  return (
    <div className={`min-h-screen ${designClasses.container}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center gap-4 py-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Select value={selectedDesign} onValueChange={setSelectedDesign}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {designs.map((design) => (
                      <SelectItem key={design.id} value={design.id}>
                        {design.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        <div
          className={`shadow-lg rounded-lg p-8 print:shadow-none print:rounded-none border ${designClasses.card}`}
          id="invoice-content"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {invoice.logo && (
                <img src={invoice.logo || "/placeholder.svg"} alt="Logo" className="h-16 mb-4 object-contain" />
              )}
              <h1 className={`text-3xl font-bold ${designClasses.title}`}>INVOICE</h1>
              <p className={designClasses.secondary}>#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className={`text-sm space-y-1 ${designClasses.secondary}`}>
                <p>
                  <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                </p>
                {invoice.dueDate && (
                  <p>
                    <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${designClasses.secondary}`}>From</h3>
              <div className={designClasses.text}>
                <p className="font-semibold">{invoice.sender.name}</p>
                {invoice.sender.email && <p>{invoice.sender.email}</p>}
                {invoice.sender.phone && <p>{invoice.sender.phone}</p>}
                {invoice.sender.address && <p className="whitespace-pre-line">{invoice.sender.address}</p>}
              </div>
            </div>
            <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${designClasses.secondary}`}>To</h3>
              <div className={designClasses.text}>
                <p className="font-semibold">{invoice.recipient.name}</p>
                {invoice.recipient.email && <p>{invoice.recipient.email}</p>}
                {invoice.recipient.phone && <p>{invoice.recipient.phone}</p>}
                {invoice.recipient.address && <p className="whitespace-pre-line">{invoice.recipient.address}</p>}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr
                  className={`border-b-2 ${selectedDesign === "minimal" ? "border-gray-300" : `border-${selectedDesign === "modern" ? "blue" : selectedDesign === "elegant" ? "purple" : "red"}-300`}`}
                >
                  <th className={`text-left py-2 font-semibold ${designClasses.secondary}`}>Description</th>
                  <th className={`text-right py-2 font-semibold ${designClasses.secondary}`}>Qty</th>
                  <th className={`text-right py-2 font-semibold ${designClasses.secondary}`}>Rate</th>
                  <th className={`text-right py-2 font-semibold ${designClasses.secondary}`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className={`py-3 ${designClasses.text}`}>{item.description}</td>
                    <td className={`py-3 text-right ${designClasses.text}`}>{item.quantity}</td>
                    <td className={`py-3 text-right ${designClasses.text}`}>
                      {selectedCurrency?.symbol}
                      {item.rate.toFixed(2)}
                    </td>
                    <td className={`py-3 text-right ${designClasses.text}`}>
                      {selectedCurrency?.symbol}
                      {item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={designClasses.secondary}>Subtotal:</span>
                  <span className={designClasses.text}>
                    {selectedCurrency?.symbol}
                    {invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className={designClasses.secondary}>Tax ({invoice.taxRate}%):</span>
                    <span className={designClasses.text}>
                      {selectedCurrency?.symbol}
                      {invoice.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className={designClasses.secondary}>Discount ({invoice.discountRate}%):</span>
                    <span className={designClasses.text}>
                      -{selectedCurrency?.symbol}
                      {invoice.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className={designClasses.secondary}>Shipping:</span>
                    <span className={designClasses.text}>
                      {selectedCurrency?.symbol}
                      {invoice.shipping.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className={`flex justify-between text-lg font-bold ${designClasses.title}`}>
                    <span>Total:</span>
                    <span>
                      {selectedCurrency?.symbol}
                      {invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {invoice.notes && (
                <div>
                  <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${designClasses.secondary}`}>
                    Notes
                  </h3>
                  <p className={`whitespace-pre-line ${designClasses.text}`}>{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className={`text-sm font-semibold uppercase tracking-wide mb-2 ${designClasses.secondary}`}>
                    Terms & Conditions
                  </h3>
                  <p className={`whitespace-pre-line ${designClasses.text}`}>{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
