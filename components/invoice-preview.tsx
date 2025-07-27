"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer } from "lucide-react"
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

export function InvoicePreview({ invoice, onBack, user }: InvoicePreviewProps) {
  const selectedCurrency = currencies.find((c) => c.code === invoice.currency)

  const handleDownloadPDF = () => {
    generatePDF(invoice)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
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
        <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none print:rounded-none" id="invoice-content">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              {invoice.logo && (
                <img src={invoice.logo || "/placeholder.svg"} alt="Logo" className="h-16 mb-4 object-contain" />
              )}
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 space-y-1">
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
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">From</h3>
              <div className="text-gray-900">
                <p className="font-semibold">{invoice.sender.name}</p>
                {invoice.sender.email && <p>{invoice.sender.email}</p>}
                {invoice.sender.phone && <p>{invoice.sender.phone}</p>}
                {invoice.sender.address && <p className="whitespace-pre-line">{invoice.sender.address}</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">To</h3>
              <div className="text-gray-900">
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
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 font-semibold text-gray-700">Description</th>
                  <th className="text-right py-2 font-semibold text-gray-700">Qty</th>
                  <th className="text-right py-2 font-semibold text-gray-700">Rate</th>
                  <th className="text-right py-2 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-gray-900">{item.description}</td>
                    <td className="py-3 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-900">
                      {selectedCurrency?.symbol}
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-gray-900">
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
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    {selectedCurrency?.symbol}
                    {invoice.subtotal.toFixed(2)}
                  </span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                    <span className="text-gray-900">
                      {selectedCurrency?.symbol}
                      {invoice.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount ({invoice.discountRate}%):</span>
                    <span className="text-gray-900">
                      -{selectedCurrency?.symbol}
                      {invoice.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {invoice.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">
                      {selectedCurrency?.symbol}
                      {invoice.shipping.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
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
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
                  <p className="text-gray-900 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Terms & Conditions
                  </h3>
                  <p className="text-gray-900 whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
