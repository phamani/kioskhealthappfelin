import { type ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

import AdminPanel from "@/components/admin-panel"

interface KioskLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
}

export default function KioskLayout({ children, currentStep, totalSteps }: KioskLayoutProps) {
  const [showAdmin, setShowAdmin] = useState(false)

  
  if (showAdmin) {
    return <AdminPanel onExit={() => setShowAdmin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-700">Health Check Kiosk</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-xl">
              {currentStep > 0 && `Step ${currentStep} of ${totalSteps - 1}`}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAdmin(true)}
              className="ml-4 rounded-full"
              title="Admin Panel"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Admin Panel</span>
            </Button>

          </div>
        </div>
      </header>

      {/* Progress bar */}
      {currentStep > 0 && (
        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-blue-600 h-2 transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-10">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 px-8 text-center text-gray-500">
        <p>© 2025 Health Check Kiosk. Touch screen to interact.</p>
        <p>This is an automated health assessment.It does not replace professional medical advice.</p>
      </footer>
    </div>
  )
}

