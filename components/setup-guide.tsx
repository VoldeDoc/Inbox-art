"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react"

interface HealthStatus {
  status: string
  services: {
    supabase: { success: boolean; message: string }
    openai: { success: boolean; message: string }
    blob: { success: boolean; message: string }
    postmark: { success: boolean; message: string }
  }
}

export function SetupGuide() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error("Health check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const services = [
    {
      key: "supabase",
      name: "Supabase Database",
      description: "PostgreSQL database for storing art pieces and subscribers",
    },
    { key: "blob", name: "Vercel Blob", description: "Image storage" },
    { key: "postmark", name: "Postmark", description: "Email service for webhooks and delivery" },
  ]

  const allHealthy = health?.services && Object.values(health.services).every((service) => service.success)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          System Health Check
        </CardTitle>
        <CardDescription>Check if all required services are properly configured</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Overall Status</h3>
            <p className="text-sm text-muted-foreground">
              {health ? (allHealthy ? "All systems operational" : "Some services need attention") : "Checking..."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {health && (
              <Badge variant={allHealthy ? "default" : "destructive"}>{allHealthy ? "Healthy" : "Issues Found"}</Badge>
            )}
            <Button variant="outline" size="sm" onClick={checkHealth} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const status = health?.services[service.key as keyof typeof health.services]
            return (
              <div key={service.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{service.name}</h4>
                    {status ? (
                      status.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  {status && !status.success && <p className="text-sm text-red-600 mt-1">{status.message}</p>}
                </div>
              </div>
            )
          })}
        </div>

        {health && !allHealthy && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-950 dark:border-yellow-800">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Setup Required</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Some services are not properly configured. Please check your environment variables and try again.
            </p>
          </div>
        )}

        {health && allHealthy && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
            <h4 className="font-medium text-green-800 dark:text-green-200">All Systems Ready!</h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your Inbox-as-Art application is fully configured and ready to use.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
