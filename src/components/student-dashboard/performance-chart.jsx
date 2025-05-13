"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export function PerformanceChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // This would typically come from an API or database
  const performanceData = {
    weekly: [65, 70, 75, 80, 85, 82, 78],
    monthly: [60, 65, 70, 75, 80, 85, 82, 78, 75, 80, 85, 90],
    yearly: [70, 75, 80, 85, 82, 78, 75, 80, 85, 90, 88, 85],
  }

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse bg-muted h-64 w-full rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
        <CardDescription>Your academic performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger className="text-white data-[state=active]:bg-white data-[state=active]:text-black" value="weekly">Weekly</TabsTrigger>
            <TabsTrigger className="text-white data-[state=active]:bg-white data-[state=active]:text-black" value="monthly">Monthly</TabsTrigger>
            <TabsTrigger className="text-white data-[state=active]:bg-white data-[state=active]:text-black" value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="h-64 relative">
            <div className="absolute inset-0 flex items-end">
              {performanceData.weekly.map((value, index) => (
                <div key={index} className="flex-1 mx-1" style={{ height: `${value}%` }}>
                  <div className="h-full bg-primary/80 rounded-t-sm"></div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="h-64 relative">
            <div className="absolute inset-0 flex items-end">
              {performanceData.monthly.map((value, index) => (
                <div key={index} className="flex-1 mx-0.5" style={{ height: `${value}%` }}>
                  <div className="h-full bg-primary/80 rounded-t-sm"></div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="h-64 relative">
            <div className="absolute inset-0 flex items-end">
              {performanceData.yearly.map((value, index) => (
                <div key={index} className="flex-1 mx-0.5" style={{ height: `${value}%` }}>
                  <div className="h-full bg-primary/80 rounded-t-sm"></div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
