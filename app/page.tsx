"use client"

import { useState, useEffect } from "react"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { InvoiceHistory } from "@/components/invoice-history"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, History } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Invoice } from "@/types/invoice"

export default function HomePage() {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("create")
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handlePreview = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setShowPreview(true)
  }

  const handleBackToForm = () => {
    setShowPreview(false)
    // Keep the current invoice data for editing
  }

  if (showPreview && currentInvoice) {
    return <InvoicePreview invoice={currentInvoice} onBack={handleBackToForm} user={user} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              Invoice History {!user && "(Local)"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <InvoiceForm 
              key={currentInvoice?.id || 'new'}
              onPreview={handlePreview} 
              user={user} 
              initialInvoice={currentInvoice} 
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <InvoiceHistory
              user={user}
              onEditInvoice={(invoice) => {
                setCurrentInvoice(invoice)
                setActiveTab("create")
              }}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
