import type { Invoice } from "@/types/invoice"

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "C$" },
  { code: "AUD", symbol: "A$" },
  { code: "JPY", symbol: "¥" },
]

export function generatePDF(invoice: Invoice) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  const currency = currencies.find((c) => c.code === invoice.currency)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        .logo {
          max-height: 80px;
          margin-bottom: 20px;
        }
        .invoice-title {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }
        .invoice-number {
          color: #666;
          margin: 5px 0;
        }
        .invoice-dates {
          text-align: right;
          font-size: 14px;
        }
        .contact-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .contact-box {
          width: 45%;
        }
        .contact-title {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .contact-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background-color: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #dee2e6;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
        }
        .items-table th:last-child,
        .items-table td:last-child {
          text-align: right;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }
        .totals-box {
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .total-row.final {
          border-top: 2px solid #333;
          font-weight: bold;
          font-size: 18px;
          margin-top: 10px;
          padding-top: 10px;
        }
        .notes-section {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .notes-box {
          width: 45%;
        }
        .notes-title {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .notes-content {
          white-space: pre-line;
          line-height: 1.5;
        }
        @media print {
          body { margin: 0; padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div>
          ${invoice.logo ? `<img src="${invoice.logo}" alt="Logo" class="logo">` : ""}
          <h1 class="invoice-title">INVOICE</h1>
          <p class="invoice-number">#${invoice.invoiceNumber}</p>
        </div>
        <div class="invoice-dates">
          <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
          ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ""}
        </div>
      </div>

      <div class="contact-section">
        <div class="contact-box">
          <div class="contact-title">From</div>
          <div class="contact-name">${invoice.sender.name}</div>
          ${invoice.sender.email ? `<div>${invoice.sender.email}</div>` : ""}
          ${invoice.sender.phone ? `<div>${invoice.sender.phone}</div>` : ""}
          ${invoice.sender.address ? `<div class="notes-content">${invoice.sender.address}</div>` : ""}
        </div>
        <div class="contact-box">
          <div class="contact-title">To</div>
          <div class="contact-name">${invoice.recipient.name}</div>
          ${invoice.recipient.email ? `<div>${invoice.recipient.email}</div>` : ""}
          ${invoice.recipient.phone ? `<div>${invoice.recipient.phone}</div>` : ""}
          ${invoice.recipient.address ? `<div class="notes-content">${invoice.recipient.address}</div>` : ""}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td style="text-align: right;">${item.quantity}</td>
              <td style="text-align: right;">${currency?.symbol}${item.rate.toFixed(2)}</td>
              <td style="text-align: right;">${currency?.symbol}${item.amount.toFixed(2)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${currency?.symbol}${invoice.subtotal.toFixed(2)}</span>
          </div>
          ${
            invoice.taxAmount > 0
              ? `
            <div class="total-row">
              <span>Tax (${invoice.taxRate}%):</span>
              <span>${currency?.symbol}${invoice.taxAmount.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          ${
            invoice.discountAmount > 0
              ? `
            <div class="total-row">
              <span>Discount (${invoice.discountRate}%):</span>
              <span>-${currency?.symbol}${invoice.discountAmount.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          ${
            invoice.shipping > 0
              ? `
            <div class="total-row">
              <span>Shipping:</span>
              <span>${currency?.symbol}${invoice.shipping.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          <div class="total-row final">
            <span>Total:</span>
            <span>${currency?.symbol}${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      ${
        invoice.notes || invoice.terms
          ? `
        <div class="notes-section">
          ${
            invoice.notes
              ? `
            <div class="notes-box">
              <div class="notes-title">Notes</div>
              <div class="notes-content">${invoice.notes}</div>
            </div>
          `
              : ""
          }
          ${
            invoice.terms
              ? `
            <div class="notes-box">
              <div class="notes-title">Terms & Conditions</div>
              <div class="notes-content">${invoice.terms}</div>
            </div>
          `
              : ""
          }
        </div>
      `
          : ""
      }
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load, then print and close
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
