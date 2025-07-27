export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Contact {
  name: string
  email: string
  phone: string
  address: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  sender: Contact
  recipient: Contact
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  shipping: number
  total: number
  currency: string
  notes: string
  terms: string
  logo: string | null
  status: "draft" | "sent" | "paid" | "overdue"
}
