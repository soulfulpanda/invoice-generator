import type { Invoice } from "@/types/invoice"

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
  { code: "CHF", symbol: "CHF" },
  { code: "CNY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
  { code: "KRW", symbol: "₩" },
  { code: "SGD", symbol: "S$" },
  { code: "HKD", symbol: "HK$" },
  { code: "NOK", symbol: "kr" },
  { code: "SEK", symbol: "kr" },
  { code: "DKK", symbol: "kr" },
  { code: "PLN", symbol: "zł" },
  { code: "CZK", symbol: "Kč" },
  { code: "HUF", symbol: "Ft" },
  { code: "RUB", symbol: "₽" },
  { code: "BRL", symbol: "R$" },
  { code: "MXN", symbol: "$" },
  { code: "ZAR", symbol: "R" },
  { code: "TRY", symbol: "₺" },
  { code: "ILS", symbol: "₪" },
  { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" },
  { code: "EGP", symbol: "£" },
  { code: "THB", symbol: "฿" },
  { code: "MYR", symbol: "RM" },
  { code: "IDR", symbol: "Rp" },
  { code: "PHP", symbol: "₱" },
  { code: "VND", symbol: "₫" },
  { code: "NZD", symbol: "NZ$" },
]

export async function generatePDF(invoice: Invoice, design = "minimal") {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import("jspdf")

  const currency = currencies.find((c) => c.code === invoice.currency)
  const doc = new jsPDF()

  // Set colors based on design
  const colors = {
    minimal: { primary: "#000000", secondary: "#666666", accent: "#f8f9fa" },
    modern: { primary: "#2563eb", secondary: "#64748b", accent: "#eff6ff" },
    elegant: { primary: "#7c3aed", secondary: "#6b7280", accent: "#f3f4f6" },
    vibrant: { primary: "#dc2626", secondary: "#374151", accent: "#fef2f2" },
  }

  const theme = colors[design as keyof typeof colors] || colors.minimal

  // Set font
  doc.setFont("helvetica")

  // Header
  doc.setFontSize(28)
  doc.setTextColor(theme.primary)
  doc.text("INVOICE", 20, 30)

  doc.setFontSize(12)
  doc.setTextColor(theme.secondary)
  doc.text(`#${invoice.invoiceNumber}`, 20, 40)

  // Date info
  doc.setFontSize(10)
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 150, 30)
  if (invoice.dueDate) {
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 150, 37)
  }

  // From/To sections
  let yPos = 60

  doc.setFontSize(10)
  doc.setTextColor(theme.secondary)
  doc.text("FROM", 20, yPos)
  doc.text("TO", 110, yPos)

  yPos += 8
  doc.setFontSize(11)
  doc.setTextColor(theme.primary)
  doc.text(invoice.sender.name, 20, yPos)
  doc.text(invoice.recipient.name, 110, yPos)

  yPos += 6
  doc.setFontSize(9)
  doc.setTextColor(theme.secondary)
  if (invoice.sender.email) {
    doc.text(invoice.sender.email, 20, yPos)
    yPos += 4
  }
  if (invoice.sender.phone) {
    doc.text(invoice.sender.phone, 20, yPos)
    yPos += 4
  }
  if (invoice.sender.address) {
    const addressLines = invoice.sender.address.split("\n")
    addressLines.forEach((line) => {
      doc.text(line, 20, yPos)
      yPos += 4
    })
  }

  // Reset yPos for recipient
  yPos = 74
  if (invoice.recipient.email) {
    doc.text(invoice.recipient.email, 110, yPos)
    yPos += 4
  }
  if (invoice.recipient.phone) {
    doc.text(invoice.recipient.phone, 110, yPos)
    yPos += 4
  }
  if (invoice.recipient.address) {
    const addressLines = invoice.recipient.address.split("\n")
    addressLines.forEach((line) => {
      doc.text(line, 110, yPos)
      yPos += 4
    })
  }

  // Items table
  yPos = 120

  // Table header
  doc.setFillColor(theme.accent)
  doc.rect(20, yPos - 5, 170, 8, "F")

  doc.setFontSize(10)
  doc.setTextColor(theme.primary)
  doc.text("Description", 22, yPos)
  doc.text("Qty", 130, yPos)
  doc.text("Rate", 150, yPos)
  doc.text("Amount", 175, yPos)

  yPos += 10

  // Table rows
  doc.setFontSize(9)
  invoice.items.forEach((item) => {
    doc.setTextColor(theme.secondary)
    doc.text(item.description, 22, yPos)
    doc.text(item.quantity.toString(), 130, yPos)
    doc.text(`${currency?.symbol}${item.rate.toFixed(2)}`, 150, yPos)
    doc.text(`${currency?.symbol}${item.amount.toFixed(2)}`, 175, yPos)
    yPos += 6
  })

  // Totals
  yPos += 10
  const totalsX = 130

  doc.setFontSize(10)
  doc.setTextColor(theme.secondary)
  doc.text("Subtotal:", totalsX, yPos)
  doc.text(`${currency?.symbol}${invoice.subtotal.toFixed(2)}`, 175, yPos)
  yPos += 6

  if (invoice.taxAmount > 0) {
    doc.text(`Tax (${invoice.taxRate}%):`, totalsX, yPos)
    doc.text(`${currency?.symbol}${invoice.taxAmount.toFixed(2)}`, 175, yPos)
    yPos += 6
  }

  if (invoice.discountAmount > 0) {
    doc.text(`Discount (${invoice.discountRate}%):`, totalsX, yPos)
    doc.text(`-${currency?.symbol}${invoice.discountAmount.toFixed(2)}`, 175, yPos)
    yPos += 6
  }

  if (invoice.shipping > 0) {
    doc.text("Shipping:", totalsX, yPos)
    doc.text(`${currency?.symbol}${invoice.shipping.toFixed(2)}`, 175, yPos)
    yPos += 6
  }

  // Total line
  doc.setLineWidth(0.5)
  doc.setDrawColor(theme.primary)
  doc.line(totalsX, yPos, 185, yPos)
  yPos += 8

  doc.setFontSize(12)
  doc.setTextColor(theme.primary)
  doc.text("Total:", totalsX, yPos)
  doc.text(`${currency?.symbol}${invoice.total.toFixed(2)}`, 175, yPos)

  // Notes and Terms
  yPos += 20
  if (invoice.notes) {
    doc.setFontSize(10)
    doc.setTextColor(theme.secondary)
    doc.text("NOTES", 20, yPos)
    yPos += 6
    doc.setFontSize(9)
    const noteLines = invoice.notes.split("\n")
    noteLines.forEach((line) => {
      doc.text(line, 20, yPos)
      yPos += 4
    })
  }

  if (invoice.terms) {
    yPos += 10
    doc.setFontSize(10)
    doc.setTextColor(theme.secondary)
    doc.text("TERMS & CONDITIONS", 20, yPos)
    yPos += 6
    doc.setFontSize(9)
    const termLines = invoice.terms.split("\n")
    termLines.forEach((line) => {
      doc.text(line, 20, yPos)
      yPos += 4
    })
  }

  // Save the PDF
  doc.save(`invoice-${invoice.invoiceNumber}.pdf`)
}
