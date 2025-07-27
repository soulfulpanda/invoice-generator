"use client"

import { useState, useEffect } from "react"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoicePreview } from "@/components/invoice-preview"
import { InvoiceHistory } from "@/components/invoice-history"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, History, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { Invoice } from "@/types/invoice"

export default function HomePage() {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setActiveTab("create")
  }

  const handlePreview = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setShowPreview(true)
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  if (showPreview && currentInvoice) {
    return <InvoicePreview invoice={currentInvoice} onBack={handleBackToForm} user={user} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Free Invoice Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowAuthModal(true)}>
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center" disabled={!user}>
              <History className="h-4 w-4 mr-2" />
              Invoice History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-6">
            <InvoiceForm onPreview={handlePreview} user={user} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {user ? (
              <InvoiceHistory
                user={user}
                onEditInvoice={(invoice) => {
                  setCurrentInvoice(invoice)
                  setActiveTab("create")
                }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Please sign in to view your invoice history.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
